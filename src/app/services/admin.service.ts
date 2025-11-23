import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardDTO } from '../models/dashboard';
import { User, UserRole } from '../models/user';

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  region?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  street?: string;
  city?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly usersUrl = 'http://localhost:8081/api/users';
  private readonly dashboardUrl = 'http://localhost:8081/api/admin/dashboard';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  createUser(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(this.resolveCreationEndpoint(payload.role), payload);
  }

  updateUserRole(userId: number, role: UserRole): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${userId}/role`, null, {
      params: { role }
    });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${userId}`);
  }

  getDashboard(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(this.dashboardUrl);
  }

  private resolveCreationEndpoint(role: UserRole): string {
    switch (role) {
      case 'ADMIN':
        return `${this.usersUrl}/add-admin`;
      case 'DRIVER':
        return `${this.usersUrl}/add-chauffeur`;
      case 'MECHANIC':
        return `${this.usersUrl}/add-mecanicien`;
      default:
        return `${this.usersUrl}/register`;
    }
  }
}
