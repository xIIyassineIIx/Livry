import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProblemType } from '../../models/probleme';
import { ProblemeService } from '../../services/probleme.service';
import { UserRole } from '../../models/user';
import { UserService } from '../../services/user.service';
import { LivraisonService } from '../../services/livraison.service';
import { Livraison, DeliveryStatus } from '../../models/livraison';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-probleme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './probleme.component.html',
  styleUrl: './probleme.component.css'
})
export class ProblemeComponent implements OnInit {
  problemForm: FormGroup;
  problemTypes: ProblemType[] = [];
  myDeliveries: Livraison[] = [];
  successMessage = '';
  errorMessage = '';
  currentRole: UserRole | null = null;
  loading = false;
  loadingDeliveries = false;

  constructor(
    private fb: FormBuilder,
    private problemService: ProblemeService,
    private userService: UserService,
    private livraisonService: LivraisonService
  ) {
    this.problemForm = this.fb.group({
      deliveryId: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.currentRole = this.userService.getRole() as UserRole | null;
    this.problemTypes = this.getAllowedProblemTypes();
    
    // Load driver's deliveries for dropdown
    if (this.currentRole === 'DRIVER') {
      this.loadMyDeliveries();
    }
  }

  loadMyDeliveries(): void {
    const driverId = this.userService.getUserId();
    if (!driverId) return;

    this.loadingDeliveries = true;
    this.livraisonService.getMyLivraisons(driverId).subscribe({
      next: (deliveries) => {
        // Only show active deliveries (not delivered or canceled)
        this.myDeliveries = deliveries.filter(d => 
          d.status !== DeliveryStatus.DELIVERED && 
          d.status !== DeliveryStatus.CANCELED
        );
        this.loadingDeliveries = false;
      },
      error: () => {
        this.loadingDeliveries = false;
      }
    });
  }

  submitProblem(): void {
    if (this.problemForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const userId = this.userService.getUserId();

    if (!userId || !this.currentRole) {
      this.errorMessage = 'Veuillez vous reconnecter.';
      return;
    }

    const { deliveryId, type, description } = this.problemForm.value;
    const id = Number(deliveryId);

    this.loading = true;
    const request$ =
      this.currentRole === 'CLIENT'
        ? this.problemService.reportProblemAsClient(userId, id, type, description)
        : this.problemService.reportProblemAsDriver(userId, id, type, description);

    request$.subscribe({
      next: () => {
        this.successMessage = 'Problème signalé avec succès 🚗💥';
        this.errorMessage = '';
        this.problemForm.reset();
        this.loading = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
        this.successMessage = '';
        this.loading = false;
      }
    });
  }

  private getAllowedProblemTypes(): ProblemType[] {
    if (this.currentRole === 'CLIENT') {
      return [ProblemType.NON_DELIVERED, ProblemType.DAMAGED_PACKAGE, ProblemType.OTHER];
    }
    return [ProblemType.DELIVERY_DELAY, ProblemType.ACCIDENT, ProblemType.CLIENT_UNREACHABLE, ProblemType.OTHER];
  }

  getTypeLabel(type: ProblemType): string {
    const labels: { [key: string]: string } = {
      'DELIVERY_DELAY': 'Retard de livraison',
      'ACCIDENT': 'Accident',
      'CLIENT_UNREACHABLE': 'Client injoignable',
      'NON_DELIVERED': 'Non livré',
      'DAMAGED_PACKAGE': 'Colis endommagé',
      'OTHER': 'Autre'
    };
    return labels[type] || type;
  }

  getDeliveryDescription(delivery: Livraison): string {
    return `#${delivery.id} - ${delivery.description} (${delivery.departureAddress.city} → ${delivery.arrivalAddress.city})`;
  }
}
