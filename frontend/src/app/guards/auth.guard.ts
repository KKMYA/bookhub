import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si l'utilisateur est connecté, il peut accéder
    if (authService.isLoggedIn()) {
        return true;
    }

    // Sinon, retour à la page connexion
    router.navigate(['/login']);

    return false;
};
