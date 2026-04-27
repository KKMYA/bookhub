import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../models/auth/auth-response';
import { LoginRequest } from '../../models/auth/login-request';
import { RegisterRequest } from '../../models/auth/register-request';
import { Endpoints } from '../../constants/endpoints';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);
    private readonly _loggedIn = signal<boolean>(false);
    private _role: string | null = null;

    readonly loggedIn = this._loggedIn.asReadonly();

    constructor(private http: HttpClient) {
        this.syncLoggedInState();
    }

    public get role(): string | null {
      if (!this.loggedIn) return null;

      if (!this._role) {
        const token = localStorage.getItem('token') ?? '';
        const payload = JSON.parse(atob(token.split('.')[1]));
        this._role = payload.role || payload.roles || payload.authorities || null;
      }
      return this._role;
    }

    private syncLoggedInState(): void {
        this._loggedIn.set(this.isBrowser && !!localStorage.getItem('token'));
    }

    private setUser(token: string): void {
        if (!this.isBrowser) {
            return;
        }

        localStorage.setItem('token', token);
        this.syncLoggedInState();
    }

    private clearToken(): void {
        if (!this.isBrowser) {
            return;
        }

        this._role = null;
        localStorage.removeItem('token');
        this.syncLoggedInState();
    }

    // Envoie les infos de connexion
    login(request: LoginRequest): Observable<AuthResponse> {
        this.syncLoggedInState();
        return this.http.post<AuthResponse>(`${Endpoints.getAuthApiEndpoint}/login`, request).pipe(
            tap(response => {
                // On garde le token dans le localStorage
                this.setUser(response.token);
            })
        );
    }

    // Création d'un nouveau compte
    register(request: RegisterRequest): Observable<AuthResponse> {
        this.syncLoggedInState();
        return this.http.post<AuthResponse>(`${Endpoints.getAuthApiEndpoint}/register`, request).pipe(
            tap(response => {
                this.setUser(response.token);
            })
        );
    }

    // Deconnexion
    logout() {
        this.clearToken();
    }

    // Savoir si l'utilisateur est connecté
    isLoggedIn(): boolean {
        this.syncLoggedInState();
        return this.loggedIn();
    }
}
