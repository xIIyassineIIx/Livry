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
    client: User = new User(
      1,
      "Ali",
      "Yassine",
      "yassine.ali@example.com",
      "CLIENT",
      "Tunis",
      36.8065,
      10.1815
    );
  livraison: Livraison = new Livraison(
    0,          // id
    0,          // chauffeurId
    0,          // clientId
    '',         // depart
    '',         // arrivee
    '',         // gouvernoratDepart
    '',         // gouvernoratArrivee
    0,          // latitudeDepart
    0,          // longitudeDepart
    '',         // details
    'PENDING',  // status par défaut
    '',         // type
    new Date()  // dateLivraison
  );

  constructor(private livraisonService: LivraisonService) {}


    ajouterLivraison() {
      console.log('Ajout de la livraison :', this.livraison);

    this.livraisonService.createLivraison(this.livraison.clientId, this.livraison)
      .subscribe({
        next: (res) => {
          console.log('Livraison ajoutée :', res);
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
    this.livraison = new Livraison(
      0, 0, 0, '', '', '', '', 0, 0, '', 'PENDING', '', new Date()
    );
  }
}
