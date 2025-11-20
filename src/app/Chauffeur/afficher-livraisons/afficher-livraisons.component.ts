import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Livraison } from '../../models/livraison';
import { LivraisonService } from '../../services/livraison.service';

@Component({
  selector: 'app-afficher-livraisons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './afficher-livraisons.component.html',
  styleUrls: ['./afficher-livraisons.component.css']
})
export class AfficherLivraisonsComponent implements OnInit{
  myLivraisons: Livraison[] = [];
  chauffeurId!: number;

  constructor(private livraisonService: LivraisonService) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      alert('Veuillez vous connecter.');
      return;
    }
    this.chauffeurId = +storedId;
    console.log('Chauffeur ID:', this.chauffeurId);

    this.loadMyLivraisons();
    console.log(this.myLivraisons);
  }

  loadMyLivraisons() {
      if (!navigator.geolocation) {
        alert('Géolocalisation non supportée par ce navigateur.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const  longitude = position.coords.longitude;
          this.livraisonService.getAvailableLivraisons(latitude, longitude).subscribe({
            next: (res) =>{ this.myLivraisons = res,console.log(longitude, latitude);},
            error: (err) => console.error(err)
          });
        },
        (err) => {
          console.error('Erreur lors de la récupération de la position :', err);
          alert('Impossible de récupérer la position actuelle.');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    
  }

  accepterLivraison(livraisonId: number) {
    this.livraisonService.acceptLivraison(livraisonId, this.chauffeurId).subscribe({
      next: () => {
        alert('Livraison acceptée !');
        this.loadMyLivraisons();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'acceptation de la livraison.');
      }
    });
  }

  updateStatus(livraison: Livraison, status: string) {
    this.livraisonService.updateLivraisonStatus(livraison.id!, this.chauffeurId, status).subscribe({
      next: () => {
        alert('Statut mis à jour !');
        this.loadMyLivraisons();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour du statut.');
      }
    });
  }
}
