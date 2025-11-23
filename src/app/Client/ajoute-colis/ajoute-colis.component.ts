import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Region } from '../../models/region';
import { DeliveryType } from '../../models/livraison';
import { LivraisonService, CreateDeliveryPayload } from '../../services/livraison.service';
import { UserService } from '../../services/user.service';
import { getErrorMessage } from '../../utils/error-handler.util';

@Component({
  selector: 'app-ajoute-colis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajoute-colis.component.html',
  styleUrls: ['./ajoute-colis.component.css']
})
export class AjouteColisComponent implements OnInit {
  regions = Object.values(Region);
  deliveryTypes = Object.values(DeliveryType);

  clientId: number | null = null;

  formData: CreateDeliveryPayload = {
    description: '',
    type: DeliveryType.DOCUMENT,
    departureAddress: {
      street: '',
      city: '',
      region: Region.TUNIS,
      postalCode: ''
    },
    arrivalAddress: {
      street: '',
      city: '',
      region: Region.TUNIS,
      postalCode: ''
    }
  };

  successMessage = '';
  errorMessage = '';

  constructor(
    private livraisonService: LivraisonService, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.userService.getUserId();
    const storedRegion = this.userService.getRegion() as Region | null;
    if (storedRegion) {
      this.formData.departureAddress.region = storedRegion;
    }

    if (!this.clientId) {
      this.errorMessage = 'Votre session a expiré. Merci de vous reconnecter.';
    }
  }

  ajouterLivraison(): void {
    if (!this.clientId) {
      this.errorMessage = 'Impossible de créer la livraison sans identifiant client.';
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.livraisonService.createLivraison(this.clientId, this.formData).subscribe({
      next: () => {
        this.successMessage = 'Livraison ajoutée avec succès !';
        this.errorMessage = '';
        this.resetForm();
        // Redirect to mypackage after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/client/mypackage']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = getErrorMessage(error);
        this.successMessage = '';
      }
    });
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.description &&
      this.formData.departureAddress.street &&
      this.formData.departureAddress.city &&
      this.formData.arrivalAddress.street &&
      this.formData.arrivalAddress.city &&
      this.formData.type
    );
  }

  resetForm(): void {
    const departureRegion = this.formData.departureAddress.region;
    this.formData = {
      description: '',
      type: DeliveryType.DOCUMENT,
      departureAddress: {
        street: '',
        city: '',
        region: departureRegion,
        postalCode: ''
      },
      arrivalAddress: {
        street: '',
        city: '',
        region: Region.TUNIS,
        postalCode: ''
      }
    };
  }
}
