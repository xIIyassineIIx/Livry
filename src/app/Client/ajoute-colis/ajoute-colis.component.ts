import { Component, AfterViewInit } from '@angular/core';

import { LivraisonService } from '../../services/livraison.service';
import { Livraison } from '../../models/livraison';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-ajoute-colis',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ajoute-colis.component.html',
  styleUrls: ['./ajoute-colis.component.css']
})
export class AjouteColisComponent {
    client: User = new User(0,'','','','','CLIENT');

  livraison: Livraison = new Livraison(
    0, // chauffeurId
    Number(localStorage.getItem('userId')), // clientId
    '', // depart
    '', // arrivee
    'Tunis', // gouvernoratDepart
    '', // gouvernoratArrivee
    0, // latitudeDepart
    0, // longitudeDepart
    '', // details
    'PENDING', // status
    '' // type
  );

  constructor(private livraisonService: LivraisonService) {}

  ngOnInit(): void {
    this.setCurrentLocation();
  }

  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.livraison.latitudeDepart = position.coords.latitude;
        this.livraison.longitudeDepart = position.coords.longitude;
      }, (err) => {
        console.warn('Impossible de récupérer la localisation :', err);
      });
    }
  }

  ajouterLivraison() {
    if (!this.livraison.depart || !this.livraison.arrivee || !this.livraison.type) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.livraisonService.createLivraison(this.livraison.clientId, this.livraison)
      .subscribe({
        next: (res) => {
          alert('Livraison ajoutée avec succès !');
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout de la livraison.');
        }
      });
  }

  resetForm() {
    this.livraison.depart = '';
    this.livraison.arrivee = '';
    this.livraison.details = '';
    this.livraison.type = '';
    this.setCurrentLocation(); // reset latitude/longitude
  }
}
