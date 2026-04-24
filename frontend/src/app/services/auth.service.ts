import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../dto/auth-response';
import { LoginRequest } from '../dto/login-request';
import { RegisterRequest } from '../dto/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/api/auth';

  constructor(private http: HttpClient) { }

  // Envoie les infos de connexion
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        // On garde le token dans le localStorage
        localStorage.setItem('token', response.token);
      })
    );
  }

  // Création d'un nouveau compte
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  // Deconnexion
  logout() {
    localStorage.removeItem('token');
  }

  // Savoir si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
