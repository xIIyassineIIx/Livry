import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livraison } from '../models/livraison';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  
  private apiUrl = 'http://localhost:8081/api/deliveries'; 

  constructor(private http: HttpClient) { }

 
  createLivraison(clientId: number, livraison: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(`${this.apiUrl}/${clientId}`, livraison);
  }

  
  getAvailableLivraisons( latitude: number, longitude: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/available`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString()
      }
    });
  }

  
  acceptLivraison(livraisonId: number, chauffeurId: number): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${livraisonId}/accept/${chauffeurId}`, {});
  }


  updateLivraisonStatus(livraisonId: number, chauffeurId: number, status: string): Observable<object> {
    return this.http.put(`${this.apiUrl}/${livraisonId}/status/${chauffeurId}`, status, {headers: { 'Content-Type': 'text/plain' }});
  }


  getPendingLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.apiUrl);
  }


  getMyLivraisons(chauffeurId: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/chauffeur/${chauffeurId}/my`);
  }
}
