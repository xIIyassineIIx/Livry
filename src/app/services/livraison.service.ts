import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { Livraison, DeliveryStatus, DeliveryType } from '../models/livraison';
import { Region } from '../models/region';

export interface CreateDeliveryPayload {
  description: string;
  type: DeliveryType;
  departureAddress: Address;
  arrivalAddress: Address;
}

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private readonly apiUrl = 'http://localhost:8081/api/deliveries';

  constructor(private http: HttpClient) {}

  createLivraison(clientId: number, payload: CreateDeliveryPayload): Observable<Livraison> {
    return this.http.post<Livraison>(`${this.apiUrl}/client/${clientId}/create`, payload);
  }

  getPendingByRegion(region: Region): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/pending/${region}`);
  }

  acceptLivraison(livraisonId: number, chauffeurId: number): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${livraisonId}/accept/${chauffeurId}`, {});
  }

  updateLivraisonStatus(livraisonId: number, chauffeurId: number, status: DeliveryStatus): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${livraisonId}/status`, null, {
      params: {
        status,
        driverId: chauffeurId
      }
    });
  }

  getMyLivraisons(chauffeurId: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/driver/${chauffeurId}/my`);
  }

  getClientHistory(clientId: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/client/${clientId}/history`);
  }

  getUnassignedDeliveries(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/unassigned`);
  }

  assignDriver(deliveryId: number, driverId: number): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${deliveryId}/assign-driver/${driverId}`, {});
  }

  transferToStation(deliveryId: number, stationId: number, driverId: number): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${deliveryId}/transfer-to-station/${stationId}`, null, {
      params: { driverId: driverId.toString() }
    });
  }
}
