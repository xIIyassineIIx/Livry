import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeliveryStatus, DeliveryType, Livraison } from '../../models/livraison';
import { Region } from '../../models/region';
import { LivraisonService } from '../../services/livraison.service';
import { UserService } from '../../services/user.service';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-afficher-livraisons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './afficher-livraisons.component.html',
  styleUrls: ['./afficher-livraisons.component.css']
})
export class AfficherLivraisonsComponent implements OnInit, OnDestroy {
  deliveries: Livraison[] = [];
  filteredDeliveries: Livraison[] = [];
  chauffeurId?: number;
  chauffeurRegion?: Region | null;
  DeliveryStatus = DeliveryStatus;
  DeliveryType = DeliveryType;
  
  searchTerm = '';
  typeFilter: DeliveryType | 'ALL' = 'ALL';
  loading = false;
  errorMessage = '';
  successMessage = '';
  refreshInterval?: any;

  constructor(
    private livraisonService: LivraisonService, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.chauffeurId = this.userService.getUserId() ?? undefined;
    this.chauffeurRegion = this.userService.getRegion() as Region | null;

    if (!this.chauffeurId) {
      this.errorMessage = 'Veuillez vous reconnecter.';
      return;
    }

    if (!this.chauffeurRegion) {
      this.errorMessage = 'Votre région n\'est pas définie. Contactez un administrateur.';
      return;
    }

    this.loadPendingDeliveries();
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => this.loadPendingDeliveries(), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadPendingDeliveries(): void {
    if (!this.chauffeurRegion) {
      return;
    }
    
    this.loading = true;
    this.livraisonService.getPendingByRegion(this.chauffeurRegion).subscribe({
      next: (res) => {
        this.deliveries = res.sort((a, b) => {
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
      
      const matchesType = this.typeFilter === 'ALL' || delivery.type === this.typeFilter;
      
      return matchesSearch && matchesType;
    });
  }

  accepterLivraison(livraisonId: number): void {
    if (!this.chauffeurId) {
      return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir accepter cette livraison ?')) {
      return;
    }

    this.livraisonService.acceptLivraison(livraisonId, this.chauffeurId).subscribe({
      next: () => {
        this.successMessage = 'Livraison acceptée avec succès ✅';
        this.errorMessage = '';
        this.loadPendingDeliveries();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
        this.successMessage = '';
      }
    });
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
}
