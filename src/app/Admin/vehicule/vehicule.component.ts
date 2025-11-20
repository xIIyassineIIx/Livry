import { Component, OnInit } from '@angular/core';
import { VehicleStatus, Vehicule } from '../../models/vehicule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculeService } from '../../services/vehicule.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user';
@Component({
  selector: 'app-vehicule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.css']
})
export class VehiculeComponent implements OnInit {

  vehicleForm: FormGroup;
  editForm: FormGroup;
  assignForm: FormGroup;
  vehicles: Vehicule[] = [];
  drivers: User[] = [];
  editingVehicle?: Vehicule;
  assigningVehicle?: Vehicule;
  showPopup = false;
  showAssignPopup = false;
  constructor(
    private fb: FormBuilder,
    private vehiculeService: VehiculeService
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      plateNumber: ['', Validators.required],
    });
    this.editForm = this.fb.group({
      brand: [''],
      model: [''],
      plateNumber: [''],
      status: ['']
    });
    this.assignForm = this.fb.group({
      driverId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehiculeService.getVehicles().subscribe(data => this.vehicles = data);
  }
  loadDrivers(): void {
    this.vehiculeService.getAllUsers().subscribe(users => {
    this.drivers = users.filter(u => u.role === 'DRIVER' && !this.vehicles.some(v => v.driver?.id === u.id));
    
    });
  }

  submitForm() {
    if (this.vehicleForm.invalid) return;

    const formValue = this.vehicleForm.value;

    const vehicle: Vehicule = {
      brand: formValue.brand,
      model: formValue.model,
      plateNumber: formValue.plateNumber,
      status: VehicleStatus.AVAILABLE,
    };

      this.vehiculeService.addVehicle(vehicle)
        .subscribe(() => {
          this.loadVehicles();
          this.resetForm();
        });
  }

 openEditPopup(vehicle: Vehicule): void {
    this.editingVehicle = vehicle;
    this.editForm.patchValue(vehicle);
    this.showPopup = true;
  }

  updateVehicle(): void {
    if (!this.editingVehicle?.id) return;
    const updated: Vehicule = { ...this.editingVehicle, ...this.editForm.value };
    this.vehiculeService.updateVehicle(this.editingVehicle.id, updated).subscribe(() => {
      this.closePopup();
      this.loadVehicles();
    });
  }

  closePopup(): void {
    this.showPopup = false;
  }


openAssignPopup(vehicle: Vehicule): void {
    this.assigningVehicle = vehicle;
    this.loadDrivers();
    console.log('Available drivers:', this.drivers);
    this.assignForm.reset();
    this.showAssignPopup = true;
  }

  assignDriver(): void {
    if (!this.assigningVehicle?.id || this.assignForm.invalid) return;
    const driverId = this.assignForm.value.driverId;

    this.vehiculeService.assignVehicle(this.assigningVehicle.id, driverId).subscribe(() => {
      this.showAssignPopup = false;
      this.loadVehicles();
    });
  }

  closeAssignPopup(): void {
    this.showAssignPopup = false;
  }





  resetForm() {
    
    this.vehicleForm.reset({ status: VehicleStatus.AVAILABLE });
  }

  // deleteVehicle(vehicle: Vehicule) {
  //   if (!vehicle.id) return;
  //   this.vehiculeService.deleteVehicle(vehicle.id).subscribe(() => {
  //     this.loadVehicles();
  //   });
  // }
}
