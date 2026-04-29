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
    private readonly _loggedIn = signal<boolean | null>(null);
    private _role: string | null = null;


    readonly loggedIn = this._loggedIn.asReadonly();

    public get isLoggedIn(): boolean {
        return this.syncLoggedInState();
    }

    constructor(private http: HttpClient) {
        this.syncLoggedInState();
    }

    public get role(): string | null {
        if (!this._loggedIn()) return null;

        if (!this._role) {
            const token = localStorage.getItem('token') ?? '';
            const payload = JSON.parse(atob(token.split('.')[1]));
            this._role = payload.role || payload.roles || payload.authorities || null;
        }
        return this._role;
    }

    private syncLoggedInState(): boolean {
        if (!this.isBrowser) {
            return false;
        }

        const isLoggedIn = !!localStorage.getItem('token');
        this._loggedIn.set(isLoggedIn);
        return isLoggedIn;
    }

    private setToken(token: string): void {
        if (!this.isBrowser) {
            return;
        }

        this._role = null;
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
                this.setToken(response.token);
            })
        );
    }

    // Création d'un nouveau compte
    register(request: RegisterRequest): Observable<AuthResponse> {
        this.syncLoggedInState();
        return this.http.post<AuthResponse>(`${Endpoints.getAuthApiEndpoint}/register`, request).pipe(
            tap(response => {
                this.setToken(response.token);
            })
        );
    }

    // Deconnexion
    logout() {
        this.clearToken();
    }


  getUserId(): number | null {
    if (!this.isBrowser) return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId ?? null;
    } catch (e) {
      console.error('Erreur décodage token', e);
      return null;
    }
  }
}
