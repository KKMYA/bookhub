import { Component, signal } from '@angular/core';
import { Input } from "../../ui/components/input/input";
import { PasswordInput } from "../../ui/components/input-password/input-password";
import { Button } from "../../ui/components/button/button";
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [Input, PasswordInput, Button],
    templateUrl: './register.html'
})
export class Register {
    readonly nom = signal('');
    readonly prenom = signal('');
    readonly telephone = signal('');
    readonly email = signal('');
    readonly password = signal('');
    readonly confirmPassword = signal('');
    readonly nomError = signal('');
    readonly prenomError = signal('');
    readonly telephoneError = signal('');
    readonly emailError = signal('');
    readonly passwordError = signal('');
    readonly confirmPasswordError = signal('');
    readonly formError = signal('');

    private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private readonly phoneRegex = /^[0-9+()\s.-]{6,20}$/;
    private readonly passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*]).{12,}$/;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    private validateForm(): boolean {
        this.nomError.set('');
        this.prenomError.set('');
        this.telephoneError.set('');
        this.emailError.set('');
        this.passwordError.set('');
        this.confirmPasswordError.set('');
        this.formError.set('');

        const normalizedNom = this.nom().trim();
        const normalizedPrenom = this.prenom().trim();
        const normalizedTelephone = this.telephone().trim();
        const normalizedEmail = this.email().trim();

        if (!normalizedNom) {
            this.nomError.set('Nom obligatoire.');
        }

        if (!normalizedPrenom) {
            this.prenomError.set('Prénom obligatoire.');
        }

        if (!normalizedEmail) {
            this.emailError.set('Email obligatoire.');
        } else if (!this.emailRegex.test(normalizedEmail)) {
            this.emailError.set("Format de l'email invalide.");
        }

        if (normalizedTelephone && !this.phoneRegex.test(normalizedTelephone)) {
            this.telephoneError.set('Format du numéro de téléphone invalide.');
        }

        if (!this.password().trim()) {
            this.passwordError.set('Mot de passe obligatoire.');
        } else if (!this.passwordRegex.test(this.password())) {
            this.passwordError.set('Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.');
        }

        if (!this.confirmPassword().trim()) {
            this.confirmPasswordError.set('Confirmation du mot de passe obligatoire.');
        } else if (this.password() !== this.confirmPassword()) {
            this.confirmPasswordError.set('Les mots de passe ne correspondent pas.');
        }

        this.nom.set(normalizedNom);
        this.prenom.set(normalizedPrenom);
        this.telephone.set(normalizedTelephone);
        this.email.set(normalizedEmail);

        const isValid = !this.nomError()
            && !this.prenomError()
            && !this.telephoneError()
            && !this.emailError()
            && !this.passwordError()
            && !this.confirmPasswordError();

        if (!isValid) {
            this.formError.set('Merci de corriger les champs en erreur.');
        }

        return isValid;
    }

    onRegister() {
        if (!this.validateForm()) {
            return;
        }

        this.authService.register({
            nom: this.nom(),
            prenom: this.prenom(),
            telephone: this.telephone(),
            email: this.email(),
            password: this.password()
        }).subscribe({
            next: (response) => {
                console.log('Inscription réussie !', response);
                
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.formError.set('Erreur lors de l\'inscription : ' + (err.error?.message || 'Erreur inconnue'));
            }
        });
    }
}
