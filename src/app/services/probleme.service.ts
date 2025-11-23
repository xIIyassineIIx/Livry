import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Problem, ProblemStatus, ProblemType } from '../models/probleme';

@Injectable({
  providedIn: 'root'
})
export class ProblemeService {
  private readonly apiUrl = 'http://localhost:8081/api/problems';

  constructor(private http: HttpClient) {}

  reportProblemAsDriver(driverId: number, deliveryId: number, type: ProblemType, description: string): Observable<Problem> {
    return this.http.post<Problem>(`${this.apiUrl}/driver`, null, {
      params: {
        driverId,
        deliveryId,
        type,
        description
      }
    });
  }

  reportProblemAsClient(clientId: number, deliveryId: number, type: ProblemType, description: string): Observable<Problem> {
    return this.http.post<Problem>(`${this.apiUrl}/client`, null, {
      params: {
        clientId,
        deliveryId,
        type,
        description
      }
    });
  }

  getAllProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.apiUrl);
  }

  updateProblemStatus(id: number, status: ProblemStatus): Observable<Problem> {
    return this.http.put<Problem>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  getProblemsByDelivery(deliveryId: number): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.apiUrl}/delivery/${deliveryId}`);
  }

  getProblemsByStatus(status: ProblemStatus): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.apiUrl}/status/${status}`);
  }
}
