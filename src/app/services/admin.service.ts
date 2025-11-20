import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user';
import { DashboardDTO } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8081/api/admin';

  constructor(private http: HttpClient) { }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  createUser(user: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

   getDashboard(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(`${this.apiUrl}/dashboard`);
  }
  updateUser(userId: number, updatedUser: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, updatedUser);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }
}
