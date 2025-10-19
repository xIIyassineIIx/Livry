import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Livraison } from '../../models/livraison';
import { LivraisonService } from '../../services/livraison.service';

@Component({
  selector: 'app-afficher-livraisons',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './afficher-livraisons.component.html',
  styleUrl: './afficher-livraisons.component.css'
})
export class AfficherLivraisonsComponent implements OnInit{
   chauffeurId = 1; 
  livraisonsDisponibles: Livraison[] = [];
  mesLivraisons: Livraison[] = [];

  constructor(private livraisonService: LivraisonService) {}

  ngOnInit(): void {
    this.chargerLivraisonsDisponibles();
    this.chargerMesLivraisons();
  }

  chargerLivraisonsDisponibles() {

    this.livraisonService.getAvailableLivraisons('Tunis', 36.8065, 10.1815)
      .subscribe({
        next: (res) => this.livraisonsDisponibles = res,
        error: (err) => console.error(err)
      });
  }

  chargerMesLivraisons() {
    this.livraisonService.getMyLivraisons(this.chauffeurId)
      .subscribe({
        next: (res) => this.mesLivraisons = res,
        error: (err) => console.error(err)
      });
  }

  accepterLivraison(livraisonId: number) {
    this.livraisonService.acceptLivraison(livraisonId, this.chauffeurId)
      .subscribe({
        next: (res) => {
          alert('Livraison acceptée !');
          this.chargerLivraisonsDisponibles();
          this.chargerMesLivraisons();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'acceptation de la livraison.');
        }
      });
  }
}
