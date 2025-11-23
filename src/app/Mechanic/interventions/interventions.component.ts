import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Intervention, InterventionStatus, InterventionType } from '../../models/intervention';
import { InterventionService, CompleteInterventionPayload } from '../../services/intervention.service';
import { UserService } from '../../services/user.service';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-mechanic-interventions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interventions.component.html',
  styleUrl: './interventions.component.css'
})
export class MechanicInterventionsComponent implements OnInit {
  interventions: Intervention[] = [];
  filteredInterventions: Intervention[] = [];
  mechanicId?: number;
  selectedIntervention: Intervention | null = null;
  showCompleteForm = false;
  completeDescription = '';
  
  statusFilter: InterventionStatus | 'ALL' = 'ALL';
  loading = false;
  successMessage = '';
  errorMessage = '';

  InterventionStatus = InterventionStatus;

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
    this.loadInterventions();
    // Auto-refresh every 30 seconds
    setInterval(() => this.loadInterventions(), 30000);
  }

  loadInterventions(): void {
    if (!this.mechanicId) return;
    
    this.loading = true;
    this.interventionService.getInterventionsForMechanic(this.mechanicId).subscribe({
      next: (data) => {
        this.interventions = data.sort((a, b) => {
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
    this.filteredInterventions = this.interventions.filter(intervention => {
      return this.statusFilter === 'ALL' || intervention.status === this.statusFilter;
    });
  }

  openCompleteForm(intervention: Intervention): void {
    this.selectedIntervention = intervention;
    this.completeDescription = '';
    this.showCompleteForm = true;
  }

  completeIntervention(): void {
    if (!this.selectedIntervention?.id || !this.completeDescription.trim()) {
      this.errorMessage = 'La description est obligatoire.';
      return;
    }

    const payload: CompleteInterventionPayload = {
      description: this.completeDescription
    };

    this.interventionService.completeIntervention(this.selectedIntervention.id, payload).subscribe({
      next: () => {
        this.successMessage = 'Intervention complétée avec succès ✅';
        this.errorMessage = '';
        this.loadInterventions();
        this.cancelComplete();
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
      }
    });
  }

  cancelComplete(): void {
    this.showCompleteForm = false;
    this.selectedIntervention = null;
    this.completeDescription = '';
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

  getTypeLabel(type?: InterventionType): string {
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
}

