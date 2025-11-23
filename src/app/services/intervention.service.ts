import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../models/intervention';

export interface CreateInterventionPayload {
  mechanicId?: number | null;
  stationId: number;
  description: string;
}

export interface CompleteInterventionPayload {
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private readonly apiUrl = 'http://localhost:8081/api/interventions';

  constructor(private http: HttpClient) {}

  createIntervention(payload: CreateInterventionPayload): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.apiUrl}/create`, payload);
  }

  getInterventionsForMechanic(mechanicId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/mechanic/${mechanicId}`);
  }

  completeIntervention(id: number, payload: CompleteInterventionPayload): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.apiUrl}/${id}/complete`, payload);
  }

  getUnassignedInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/unassigned`);
  }

  assignMechanic(interventionId: number, mechanicId: number): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/${interventionId}/assign/${mechanicId}`, {});
  }
}

