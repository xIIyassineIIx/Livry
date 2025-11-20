import { Component, OnInit } from '@angular/core';
import { Livraison } from '../../models/livraison';
import { LivraisonService } from '../../services/livraison.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-livraisons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-livraisons.component.html',
  styleUrl: './mes-livraisons.component.css'
})
export class MesLivraisonsComponent implements OnInit {
  chauffeurId = Number(localStorage.getItem('userId'));
  mesLivraisons: Livraison[] = [];

  constructor(private livraisonService: LivraisonService) {}

  ngOnInit(): void {
    this.chargerMesLivraisons();
  }

  chargerMesLivraisons() {
    this.livraisonService.getMyLivraisons(this.chauffeurId).subscribe({
      next: (res) => {
        this.mesLivraisons = res;
        console.log('Mes livraisons :', res);
      },
      error: (err) => console.error('Erreur lors du chargement des livraisons :', err)
    });
  }

  changerStatut(livraisonId: number, nouveauStatut: string) {
    this.livraisonService.updateLivraisonStatus(livraisonId, this.chauffeurId, nouveauStatut).subscribe({
      next: () => {
        alert(`Statut changé en ${nouveauStatut}`);
        this.chargerMesLivraisons(); 
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors du changement de statut.');
      }
    });
  }
}
