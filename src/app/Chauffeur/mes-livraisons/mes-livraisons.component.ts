import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import * as L from 'leaflet';
import * as polyline from '@mapbox/polyline';
import { DeliveryStatus, DeliveryType, Livraison } from '../../models/livraison';
import { LivraisonService } from '../../services/livraison.service';
import { UserService } from '../../services/user.service';
import { StationService } from '../../services/station.service';
import { Station } from '../../models/station';
import { GeocodingService, Coordinates } from '../../services/geocoding.service';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-mes-livraisons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-livraisons.component.html',
  styleUrl: './mes-livraisons.component.css'
})
export class MesLivraisonsComponent implements OnInit, AfterViewInit, OnDestroy {
  chauffeurId?: number;
  mesLivraisons: Livraison[] = [];
  filteredLivraisons: Livraison[] = [];
  stations: Station[] = [];
  DeliveryStatus = DeliveryStatus;
  DeliveryType = DeliveryType;
  
  showTransferForm = false;
  selectedLivraison: Livraison | null = null;
  selectedStationId: number = 0;
  
  statusFilter: DeliveryStatus | 'ALL' = 'ALL';
  searchTerm = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  refreshInterval?: any;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private routePolylines: L.Polyline[] = [];
  showMap = false;

  constructor(
    private livraisonService: LivraisonService, 
    private userService: UserService,
    private stationService: StationService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.chauffeurId = this.userService.getUserId() ?? undefined;
    if (!this.chauffeurId) {
      this.errorMessage = 'Veuillez vous reconnecter.';
      return;
    }
    this.chargerMesLivraisons();
    this.loadStations();
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => this.chargerMesLivraisons(), 30000);
  }

  ngAfterViewInit(): void {
    // Map will be initialized when showMap is true
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.map) {
      this.map.remove();
    }
  }

  loadStations(): void {
    this.stationService.getAllStations().subscribe({
      next: (data) => (this.stations = data),
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
      }
    });
  }

  chargerMesLivraisons(): void {
    if (!this.chauffeurId) {
      return;
    }
    
    this.loading = true;
    this.livraisonService.getMyLivraisons(this.chauffeurId).subscribe({
      next: (res) => {
        this.mesLivraisons = res.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA; // Most recent first
        });
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredLivraisons = this.mesLivraisons.filter(livraison => {
      const matchesSearch = !this.searchTerm || 
        livraison.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        livraison.departureAddress.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        livraison.arrivalAddress.city.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'ALL' || livraison.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Update map if it's visible
    if (this.showMap && this.map) {
      this.displayAllDeliveriesOnMap();
    }
  }

  changerStatut(livraisonId: number, nouveauStatut: DeliveryStatus): void {
    if (!this.chauffeurId) {
      return;
    }

    const confirmMessage = nouveauStatut === DeliveryStatus.DELIVERED 
      ? 'Marquer cette livraison comme livrée ?'
      : nouveauStatut === DeliveryStatus.CANCELED
      ? 'Êtes-vous sûr de vouloir annuler cette livraison ?'
      : 'Mettre à jour le statut ?';

    if (!confirm(confirmMessage)) {
      return;
    }

    this.livraisonService.updateLivraisonStatus(livraisonId, this.chauffeurId, nouveauStatut).subscribe({
      next: () => {
        this.successMessage = 'Statut mis à jour avec succès ✅';
        this.errorMessage = '';
        this.chargerMesLivraisons();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
        this.successMessage = '';
      }
    });
  }

  openTransferForm(livraison: Livraison): void {
    this.selectedLivraison = livraison;
    this.selectedStationId = 0;
    this.showTransferForm = true;
  }

  transferToStation(): void {
    if (!this.selectedLivraison?.id || !this.chauffeurId || !this.selectedStationId) {
      this.errorMessage = 'Veuillez sélectionner une station.';
      return;
    }

    this.livraisonService.transferToStation(this.selectedLivraison.id, this.selectedStationId, this.chauffeurId).subscribe({
      next: () => {
        this.successMessage = 'Livraison transférée à la station avec succès ✅';
        this.errorMessage = '';
        this.chargerMesLivraisons();
        this.cancelTransfer();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
        this.successMessage = '';
      }
    });
  }

  cancelTransfer(): void {
    this.showTransferForm = false;
    this.selectedLivraison = null;
    this.selectedStationId = 0;
  }

  getStatusClass(status?: DeliveryStatus): string {
    if (!status) return 'pending';
    return status.toLowerCase().replace('_', '-');
  }

  getStatusLabel(status?: DeliveryStatus): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'ACCEPTED': 'Acceptée',
      'IN_TRANSIT': 'En transit',
      'DRIVER_TRANSFER': 'Transférée',
      'DELIVERED': 'Livrée',
      'CANCELED': 'Annulée'
    };
    return labels[status || 'PENDING'] || status || 'Inconnu';
  }

  getTypeLabel(type: DeliveryType): string {
    const labels: { [key: string]: string } = {
      'DOCUMENT': 'Document',
      'FRAGILE': 'Fragile',
      'FOOD': 'Nourriture',
      'OTHER': 'Autre'
    };
    return labels[type] || type;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  canUpdateStatus(status?: DeliveryStatus): boolean {
    return status !== DeliveryStatus.DELIVERED && status !== DeliveryStatus.CANCELED;
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => {
        this.initMap();
        this.displayAllDeliveriesOnMap();
      }, 100);
    } else {
      if (this.map) {
        this.map.remove();
      }
    }
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }
    
    this.map = L.map('driver-map', {
      center: [36.8065, 10.1815], // Default to Tunis
      zoom: 10
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  async displayAllDeliveriesOnMap(): Promise<void> {
    if (!this.map || this.filteredLivraisons.length === 0) {
      return;
    }

    this.clearMap();

    const bounds: L.LatLngBounds = new L.LatLngBounds([]);
    const deliveryPromises: Promise<void>[] = [];

    for (const livraison of this.filteredLivraisons) {
      const promise = this.addDeliveryToMap(livraison, bounds);
      deliveryPromises.push(promise);
    }

    await Promise.all(deliveryPromises);

    if (bounds.isValid()) {
      this.map.fitBounds(bounds.pad(0.1));
    }
  }

  async addDeliveryToMap(livraison: Livraison, bounds: L.LatLngBounds): Promise<void> {
    try {
      const [departureCoords, arrivalCoords] = await Promise.all([
        firstValueFrom(this.geocodingService.geocodeAddress(livraison.departureAddress)),
        firstValueFrom(this.geocodingService.geocodeAddress(livraison.arrivalAddress))
      ]);

      if (!departureCoords || !arrivalCoords) {
        return;
      }

      const routeColor = this.getRouteColor(livraison.status);

      // Add departure marker
      const startIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${routeColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const startMarker = L.marker([departureCoords.lat, departureCoords.lng], { icon: startIcon })
        .addTo(this.map)
        .bindPopup(`
          <strong>📍 Départ - Livraison #${livraison.id}</strong><br>
          ${livraison.description}<br>
          ${livraison.departureAddress.street}<br>
          ${livraison.departureAddress.city}, ${livraison.departureAddress.region}
        `);

      // Add arrival marker
      const endIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${routeColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const endMarker = L.marker([arrivalCoords.lat, arrivalCoords.lng], { icon: endIcon })
        .addTo(this.map)
        .bindPopup(`
          <strong>🎯 Destination - Livraison #${livraison.id}</strong><br>
          ${livraison.description}<br>
          ${livraison.arrivalAddress.street}<br>
          ${livraison.arrivalAddress.city}, ${livraison.arrivalAddress.region}<br>
          <strong>Statut:</strong> ${this.getStatusLabel(livraison.status)}
        `);

      this.markers.push(startMarker, endMarker);
      bounds.extend([departureCoords.lat, departureCoords.lng]);
      bounds.extend([arrivalCoords.lat, arrivalCoords.lng]);

      // Draw route
      await this.drawRoute(departureCoords, arrivalCoords, routeColor);

    } catch (error) {
      console.error(`Error adding delivery ${livraison.id} to map:`, error);
    }
  }

  async drawRoute(start: Coordinates, end: Coordinates, color: string): Promise<void> {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=polyline`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;
        const decoded = polyline.decode(route).map(([lat, lon]) => [lat, lon] as [number, number]);

        const routePolyline = L.polyline(decoded as L.LatLngExpression[], {
          color: color,
          weight: 4,
          opacity: 0.6
        }).addTo(this.map);

        this.routePolylines.push(routePolyline);
      }
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  }

  getRouteColor(status?: DeliveryStatus): string {
    switch (status) {
      case DeliveryStatus.DELIVERED:
        return '#28a745';
      case DeliveryStatus.IN_TRANSIT:
      case DeliveryStatus.ACCEPTED:
        return '#007bff';
      case DeliveryStatus.DRIVER_TRANSFER:
        return '#ffc107';
      case DeliveryStatus.CANCELED:
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }

  clearMap(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
    this.routePolylines.forEach(polyline => this.map.removeLayer(polyline));
    this.routePolylines = [];
  }

  selectDeliveryOnMap(livraison: Livraison): void {
    if (!this.showMap) {
      this.toggleMap();
      setTimeout(() => {
        this.focusOnDelivery(livraison);
      }, 200);
    } else {
      this.focusOnDelivery(livraison);
    }
  }

  async focusOnDelivery(livraison: Livraison): Promise<void> {
    this.clearMap();
    try {
      const [departureCoords, arrivalCoords] = await Promise.all([
        firstValueFrom(this.geocodingService.geocodeAddress(livraison.departureAddress)),
        firstValueFrom(this.geocodingService.geocodeAddress(livraison.arrivalAddress))
      ]);

      if (!departureCoords || !arrivalCoords) {
        this.errorMessage = 'Impossible de localiser les adresses sur la carte.';
        return;
      }

      const routeColor = this.getRouteColor(livraison.status);

      // Add markers
      const startMarker = L.marker([departureCoords.lat, departureCoords.lng])
        .addTo(this.map)
        .bindPopup(`
          <strong>📍 Départ</strong><br>
          ${livraison.description}<br>
          ${livraison.departureAddress.street}<br>
          ${livraison.departureAddress.city}, ${livraison.departureAddress.region}
        `)
        .openPopup();

      const endMarker = L.marker([arrivalCoords.lat, arrivalCoords.lng])
        .addTo(this.map)
        .bindPopup(`
          <strong>🎯 Destination</strong><br>
          ${livraison.description}<br>
          ${livraison.arrivalAddress.street}<br>
          ${livraison.arrivalAddress.city}, ${livraison.arrivalAddress.region}<br>
          <strong>Statut:</strong> ${this.getStatusLabel(livraison.status)}
        `);

      this.markers = [startMarker, endMarker];

      // Draw route
      await this.drawRoute(departureCoords, arrivalCoords, routeColor);

      // Fit map to show both markers
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));

    } catch (error) {
      console.error('Error focusing on delivery:', error);
      this.errorMessage = 'Erreur lors de l\'affichage de la livraison sur la carte.';
    }
  }
}
