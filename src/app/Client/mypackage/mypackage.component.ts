import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import * as polyline from '@mapbox/polyline';
import { Livraison, DeliveryStatus } from '../../models/livraison';
import { LivraisonService } from '../../services/livraison.service';
import { UserService } from '../../services/user.service';
import { GeocodingService, Coordinates } from '../../services/geocoding.service';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-mypackage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mypackage.component.html',
  styleUrl: './mypackage.component.css'
})
export class MypackageComponent implements OnInit, AfterViewInit, OnDestroy {
  deliveries: Livraison[] = [];
  filteredDeliveries: Livraison[] = [];
  selectedDelivery: Livraison | null = null;
  clientId: number | null = null;
  
  searchTerm = '';
  statusFilter: DeliveryStatus | 'ALL' = 'ALL';
  
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private routePolyline?: L.Polyline;
  private refreshInterval?: any;
  
  DeliveryStatus = DeliveryStatus;
  errorMessage = '';
  loading = false;

  constructor(
    private livraisonService: LivraisonService,
    private userService: UserService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.clientId = this.userService.getUserId();
    if (!this.clientId) {
      this.errorMessage = 'Veuillez vous reconnecter.';
      return;
    }
    this.loadDeliveries();
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => this.loadDeliveries(), 30000);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.map) {
      this.map.remove();
    }
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [36.8065, 10.1815], // Default to Tunis
      zoom: 10
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  loadDeliveries(): void {
    if (!this.clientId) return;
    
    this.loading = true;
    this.livraisonService.getClientHistory(this.clientId).subscribe({
      next: (data) => {
        this.deliveries = data.sort((a, b) => {
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
    this.filteredDeliveries = this.deliveries.filter(delivery => {
      const matchesSearch = !this.searchTerm || 
        delivery.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        delivery.departureAddress.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        delivery.arrivalAddress.city.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'ALL' || delivery.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // If a delivery was selected, keep it selected if it's still in filtered list
    if (this.selectedDelivery && !this.filteredDeliveries.includes(this.selectedDelivery)) {
      this.selectedDelivery = null;
      this.clearMap();
    }
  }

  selectDelivery(delivery: Livraison): void {
    this.selectedDelivery = delivery;
    this.displayDeliveryOnMap(delivery);
  }

  async displayDeliveryOnMap(delivery: Livraison): Promise<void> {
    this.clearMap();

    try {
      // Geocode both addresses
      const [departureCoords, arrivalCoords] = await Promise.all([
        firstValueFrom(this.geocodingService.geocodeAddress(delivery.departureAddress)),
        firstValueFrom(this.geocodingService.geocodeAddress(delivery.arrivalAddress))
      ]);

      if (!departureCoords || !arrivalCoords) {
        this.errorMessage = 'Impossible de localiser les adresses sur la carte.';
        return;
      }

      // Add markers
      const startMarker = L.marker([departureCoords.lat, departureCoords.lng])
        .addTo(this.map)
        .bindPopup(`
          <strong>Départ</strong><br>
          ${delivery.departureAddress.street}<br>
          ${delivery.departureAddress.city}, ${delivery.departureAddress.region}
        `)
        .openPopup();

      const endMarker = L.marker([arrivalCoords.lat, arrivalCoords.lng])
        .addTo(this.map)
        .bindPopup(`
          <strong>Destination</strong><br>
          ${delivery.arrivalAddress.street}<br>
          ${delivery.arrivalAddress.city}, ${delivery.arrivalAddress.region}
        `);

      this.markers = [startMarker, endMarker];

      // Draw route
      await this.drawRoute(departureCoords, arrivalCoords);

      // Fit map to show both markers
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));

    } catch (error) {
      console.error('Error displaying delivery on map:', error);
      this.errorMessage = 'Erreur lors de l\'affichage de la livraison sur la carte.';
    }
  }

  async drawRoute(start: Coordinates, end: Coordinates): Promise<void> {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=polyline`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;
        const decoded = polyline.decode(route).map(([lat, lon]) => [lat, lon] as [number, number]);

        this.routePolyline = L.polyline(decoded as L.LatLngExpression[], {
          color: this.getRouteColor(this.selectedDelivery?.status),
          weight: 5,
          opacity: 0.7
        }).addTo(this.map);
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
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
      this.routePolyline = undefined;
    }
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
}
