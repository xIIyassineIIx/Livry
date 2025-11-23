import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../models/facture';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private readonly apiUrl = 'http://localhost:8081/api/factures';

  constructor(private http: HttpClient) {}

  getFacturesByClient(clientId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getFactureByDelivery(deliveryId: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/delivery/${deliveryId}`);
  }
}

