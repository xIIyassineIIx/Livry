import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Livraison, DeliveryStatus } from '../../models/livraison';
import { LivraisonService } from '../../services/livraison.service';
import { UserService } from '../../services/user.service';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-chauffeur-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ChauffeurDashboardComponent implements OnInit {
  deliveries: Livraison[] = [];
  chauffeurId?: number;
  
  stats = {
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    inTransfer: 0
  };
  
  recentDeliveries: Livraison[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private livraisonService: LivraisonService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.chauffeurId = this.userService.getUserId() ?? undefined;
    if (!this.chauffeurId) {
      this.errorMessage = 'Veuillez vous reconnecter.';
      return;
    }
    this.loadData();
  }

  loadData(): void {
    if (!this.chauffeurId) return;
    
    this.loading = true;
    this.livraisonService.getMyLivraisons(this.chauffeurId).subscribe({
      next: (data) => {
        this.deliveries = data;
        this.calculateStats();
        this.recentDeliveries = data
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 5);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats = {
      total: this.deliveries.length,
      pending: this.deliveries.filter(d => d.status === DeliveryStatus.PENDING).length,
      inTransit: this.deliveries.filter(d => 
        d.status === DeliveryStatus.IN_TRANSIT || 
        d.status === DeliveryStatus.ACCEPTED
      ).length,
      delivered: this.deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length,
      inTransfer: this.deliveries.filter(d => d.status === DeliveryStatus.DRIVER_TRANSFER).length
    };
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
      day: 'numeric'
    });
  }

  getDeliveryRate(): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.delivered / this.stats.total) * 100);
  }
}

