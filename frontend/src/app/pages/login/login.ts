import { Component, signal } from '@angular/core';
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
    readonly email = signal('');
    readonly password = signal('');
    readonly emailError = signal('');
    readonly passwordError = signal('');
    readonly formError = signal('');

    private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    private validateForm(): boolean {
        this.emailError.set('');
        this.passwordError.set('');
        this.formError.set('');

        const normalizedEmail = this.email().trim();

        if (!normalizedEmail) {
            this.emailError.set('Email obligatoire.');
        } else if (!this.emailRegex.test(normalizedEmail)) {
            this.emailError.set("Format de l'email invalide.");
        }

        if (!this.password().trim()) {
            this.passwordError.set('Mot de passe obligatoire.');
        }

        this.email.set(normalizedEmail);

        const isValid = !this.emailError() && !this.passwordError();

        if (!isValid) {
            this.formError.set('Merci de corriger les champs en erreur.');
        }

        return isValid;
    }

    onLogin() {
        if (!this.validateForm()) {
            return;
        }

        this.authService.login({ email: this.email(), password: this.password() }).subscribe({
            next: (response) => {
                console.log('Connexion réussie !', response);
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.formError.set('Erreur de connexion : ' + (err.error?.message || 'Identifiants incorrects'));
            }
        });
    }
}
