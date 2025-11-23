import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Station } from '../../models/station';
import { StationService } from '../../services/station.service';
import { Region } from '../../models/region';

@Component({
  selector: 'app-station',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './station.component.html',
  styleUrl: './station.component.css'
})
export class StationComponent implements OnInit {
  stations: Station[] = [];
  regions = Object.values(Region);
  
  station: Partial<Station> = {
    name: '',
    region: Region.TUNIS
  };
  
  editingStation: Station | null = null;
  showForm = false;
  successMessage = '';
  errorMessage = '';
  
  // Form data that's always available for two-way binding
  formData: Partial<Station> = {
    name: '',
    region: Region.TUNIS
  };

  constructor(private stationService: StationService) {}

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.stationService.getAllStations().subscribe({
      next: (data) => (this.stations = data),
      error: () => (this.errorMessage = 'Erreur lors du chargement des stations.')
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  addStation(): void {
    if (!this.formData.name || !this.formData.region) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    this.stationService.createStation(this.formData as Station).subscribe({
      next: () => {
        this.successMessage = 'Station créée avec succès ✅';
        this.errorMessage = '';
        this.loadStations();
        this.resetForm();
        this.showForm = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création de la station.';
      }
    });
  }

  startEdit(station: Station): void {
    this.editingStation = { ...station };
    this.formData = { ...station };
    this.showForm = true;
  }

  updateStation(): void {
    if (!this.editingStation?.id || !this.formData.name || !this.formData.region) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    const updatedStation: Station = {
      ...this.editingStation,
      name: this.formData.name!,
      region: this.formData.region!
    };

    this.stationService.updateStation(this.editingStation.id, updatedStation).subscribe({
      next: () => {
        this.successMessage = 'Station mise à jour avec succès ✅';
        this.errorMessage = '';
        this.loadStations();
        this.resetForm();
        this.showForm = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour de la station.';
      }
    });
  }

  deleteStation(station: Station): void {
    if (!station.id) return;
    
    if (confirm(`Supprimer la station ${station.name} ?`)) {
      this.stationService.deleteStation(station.id).subscribe({
        next: () => {
          this.successMessage = 'Station supprimée avec succès ✅';
          this.loadStations();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la suppression de la station.';
        }
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showForm = false;
  }

  resetForm(): void {
    this.formData = { name: '', region: Region.TUNIS };
    this.station = { name: '', region: Region.TUNIS };
    this.editingStation = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}

