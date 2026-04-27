import { Component } from '@angular/core';
import { Button } from "../../ui/components/button/button";
import { Input } from "../../ui/components/input/input";
import { PasswordInput } from "../../ui/components/input-password/input-password";
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [Button, Input, PasswordInput],
    templateUrl: './login.html'
})

export class Login {
    email = '';
    password = '';
    emailError = '';
    passwordError = '';
    formError = '';

    private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    private validateForm(): boolean {
        this.emailError = '';
        this.passwordError = '';
        this.formError = '';

        const normalizedEmail = this.email.trim();

        if (!normalizedEmail) {
            this.emailError = 'Email obligatoire.';
        } else if (!this.emailRegex.test(normalizedEmail)) {
            this.emailError = "Format de l'email invalide.";
        }

        if (!this.password.trim()) {
            this.passwordError = 'Mot de passe obligatoire.';
        }

        this.email = normalizedEmail;

        const isValid = !this.emailError && !this.passwordError;

        if (!isValid) {
            this.formError = 'Merci de corriger les champs en erreur.';
        }

        return isValid;
    }

    onLogin() {
        if (!this.validateForm()) {
            return;
        }

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (response) => {
                console.log('Connexion réussie !', response);
                
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.formError = 'Erreur de connexion : ' + (err.error?.message || 'Identifiants incorrects');
            }
        });
    }
}
