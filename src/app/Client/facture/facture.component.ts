import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Facture } from '../../models/facture';
import { FactureService } from '../../services/facture.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.css'
})
export class FactureComponent implements OnInit {
  factures: Facture[] = [];
  clientId?: number;
  errorMessage = '';

  constructor(
    private factureService: FactureService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.clientId = this.userService.getUserId() ?? undefined;
    if (!this.clientId) {
      alert('Veuillez vous reconnecter.');
      return;
    }
    this.loadFactures();
  }

  loadFactures(): void {
    if (!this.clientId) return;
    
    this.factureService.getFacturesByClient(this.clientId).subscribe({
      next: (data) => (this.factures = data),
      error: () => (this.errorMessage = 'Erreur lors du chargement des factures.')
    });
  }

  getTotalAmount(): number {
    return this.factures.reduce((sum, facture) => sum + facture.montant, 0);
  }
}

