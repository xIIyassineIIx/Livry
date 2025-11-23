import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Intervention, InterventionStatus } from '../../models/intervention';
import { InterventionService } from '../../services/intervention.service';
import { UserService } from '../../services/user.service';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class MechanicDashboardComponent implements OnInit {
  interventions: Intervention[] = [];
  mechanicId?: number;
  
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  };
  
  recentInterventions: Intervention[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private interventionService: InterventionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.mechanicId = this.userService.getUserId() ?? undefined;
    if (!this.mechanicId) {
      this.errorMessage = 'Veuillez vous reconnecter.';
      return;
    }
    this.loadData();
  }

  loadData(): void {
    if (!this.mechanicId) return;
    
    this.loading = true;
    this.interventionService.getInterventionsForMechanic(this.mechanicId).subscribe({
      next: (data) => {
        this.interventions = data;
        this.calculateStats();
        this.recentInterventions = data
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
      total: this.interventions.length,
      pending: this.interventions.filter(i => i.status === InterventionStatus.PENDING).length,
      inProgress: this.interventions.filter(i => i.status === InterventionStatus.IN_PROGRESS).length,
      completed: this.interventions.filter(i => i.status === InterventionStatus.COMPLETED).length
    };
  }

  getStatusClass(status?: InterventionStatus): string {
    if (!status) return 'pending';
    return status.toLowerCase().replace('_', '-');
  }

  getStatusLabel(status?: InterventionStatus): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée'
    };
    return labels[status || 'PENDING'] || status || 'Inconnu';
  }

  getTypeLabel(type?: string): string {
    const labels: { [key: string]: string } = {
      'MAINTENANCE': 'Maintenance',
      'REPARATION': 'Réparation',
      'INSPECTION': 'Inspection',
      'NETTOYAGE': 'Nettoyage'
    };
    return labels[type || ''] || type || 'N/A';
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

  getCompletionRate(): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.completed / this.stats.total) * 100);
  }
}

