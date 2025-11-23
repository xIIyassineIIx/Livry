import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Intervention, InterventionStatus } from '../../models/intervention';
import { InterventionService, CreateInterventionPayload, CompleteInterventionPayload } from '../../services/intervention.service';
import { StationService } from '../../services/station.service';
import { UserService } from '../../services/user.service';
import { Station } from '../../models/station';
import { User } from '../../models/user';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {
  interventions: Intervention[] = [];
  unassignedInterventions: Intervention[] = [];
  stations: Station[] = [];
  mechanics: User[] = [];
  
  showCreateForm = false;
  showAssignForm = false;
  selectedIntervention: Intervention | null = null;
  selectedMechanicId: number = 0;
  
  interventionForm: CreateInterventionPayload = {
    stationId: 0,
    description: '',
    mechanicId: null
  };
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private interventionService: InterventionService,
    private stationService: StationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUnassignedInterventions();
    this.loadStations();
    this.loadMechanics();
  }

  loadUnassignedInterventions(): void {
    this.interventionService.getUnassignedInterventions().subscribe({
      next: (data) => (this.unassignedInterventions = data),
      error: () => (this.errorMessage = 'Erreur lors du chargement des interventions.')
    });
  }

  loadStations(): void {
    this.stationService.getAllStations().subscribe({
      next: (data) => (this.stations = data),
      error: () => (this.errorMessage = 'Erreur lors du chargement des stations.')
    });
  }

  loadMechanics(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.mechanics = users.filter(u => u.role === 'MECHANIC');
      },
      error: () => (this.errorMessage = 'Erreur lors du chargement des mécaniciens.')
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  createIntervention(): void {
    if (!this.interventionForm.stationId || !this.interventionForm.description) {
      this.errorMessage = 'La station et la description sont obligatoires.';
      return;
    }

    this.interventionService.createIntervention(this.interventionForm).subscribe({
      next: () => {
        this.successMessage = 'Intervention créée avec succès ✅';
        this.errorMessage = '';
        this.loadUnassignedInterventions();
        this.resetForm();
        this.showCreateForm = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création de l\'intervention.';
      }
    });
  }

  openAssignForm(intervention: Intervention): void {
    this.selectedIntervention = intervention;
    this.showAssignForm = true;
  }

  assignMechanic(mechanicId: number): void {
    if (!this.selectedIntervention?.id) return;

    this.interventionService.assignMechanic(this.selectedIntervention.id, mechanicId).subscribe({
      next: () => {
        this.successMessage = 'Mécanicien assigné avec succès ✅';
        this.errorMessage = '';
        this.loadUnassignedInterventions();
        this.showAssignForm = false;
        this.selectedIntervention = null;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'assignation du mécanicien.';
      }
    });
  }

  cancelAssign(): void {
    this.showAssignForm = false;
    this.selectedIntervention = null;
  }

  resetForm(): void {
    this.interventionForm = {
      stationId: 0,
      description: '',
      mechanicId: null
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}

