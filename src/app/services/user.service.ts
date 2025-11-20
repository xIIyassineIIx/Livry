import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((user: any) => {
        if (user && user.id) {
          localStorage.setItem('userRole', user.role); 
          localStorage.setItem('userId', user.id); 
        }
      })
    );
  }
  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userRole');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

}
