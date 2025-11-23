import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User, UserRole } from '../models/user';

export interface LoginResponse {
  token: string;
  email: string;
  userId: number;
  role: UserRole;
  region?: string | null;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUserRole(userId: number, role: UserRole): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/role`, null, {
      params: { role }
    });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addAdmin(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add-admin`, user);
  }

  addChauffeur(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add-chauffeur`, user);
  }

  addMecanicien(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add-mecanicien`, user);
  }

  logout(): void {
    localStorage.removeItem('livry_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRegion');
    localStorage.removeItem('userEmail');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('livry_token');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserId(): number | null {
    const stored = localStorage.getItem('userId');
    return stored ? Number(stored) : null;
  }

  getRegion(): string | null {
    return localStorage.getItem('userRegion');
  }

  private persistSession(response: LoginResponse): void {
    localStorage.setItem('livry_token', response.token);
    localStorage.setItem('userRole', response.role);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('userEmail', response.email);
    if (response.region) {
      localStorage.setItem('userRegion', response.region);
    } else {
      localStorage.removeItem('userRegion');
    }
  }
}



