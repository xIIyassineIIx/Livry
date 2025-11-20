import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicule } from '../models/vehicule';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  private baseUrl = 'http://localhost:8081/api/admin/vehicles';
  private usersUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) { }

  // Get all vehicles
  getVehicles(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(this.baseUrl);
  }

  // Add new vehicle
  addVehicle(vehicle: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(this.baseUrl, vehicle);
  }

  // Update vehicle
  updateVehicle(vehicleId: number, vehicle: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.baseUrl}/${vehicleId}`, vehicle);
  }

  // Assign vehicle to driver
  assignVehicle(vehicleId: number, driverId: number): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.baseUrl}/${vehicleId}/assign/${driverId}`, {});
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }
}
