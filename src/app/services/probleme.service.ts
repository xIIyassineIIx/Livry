import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Problem } from '../models/probleme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemeService {

  private apiUrl = 'http://localhost:8081/api/problems';

  constructor(private http: HttpClient) {}

  reportProblem(problem: Problem): Observable<Problem> {
    return this.http.post<Problem>(this.apiUrl, problem);
  }

  getAllProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.apiUrl);
  }

  markAsResolved(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/resolve`, {});
  }
}