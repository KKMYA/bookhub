import { Component } from '@angular/core';
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
    nom = '';
    prenom = '';
    telephone = '';
    email = '';
    password = '';
    confirmPassword = '';
    nomError = '';
    prenomError = '';
    telephoneError = '';
    emailError = '';
    passwordError = '';
    confirmPasswordError = '';
    formError = '';

    private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private readonly phoneRegex = /^[0-9+()\s.-]{6,20}$/;
    private readonly passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*]).{12,}$/;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    private validateForm(): boolean {
        this.nomError = '';
        this.prenomError = '';
        this.telephoneError = '';
        this.emailError = '';
        this.passwordError = '';
        this.confirmPasswordError = '';
        this.formError = '';

        const normalizedNom = this.nom.trim();
        const normalizedPrenom = this.prenom.trim();
        const normalizedTelephone = this.telephone.trim();
        const normalizedEmail = this.email.trim();

        if (!normalizedNom) {
            this.nomError = 'Nom obligatoire.';
        }

        if (!normalizedPrenom) {
            this.prenomError = 'Prénom obligatoire.';
        }

        if (!normalizedEmail) {
            this.emailError = 'Email obligatoire.';
        } else if (!this.emailRegex.test(normalizedEmail)) {
            this.emailError = "Format de l'email invalide.";
        }

        if (normalizedTelephone && !this.phoneRegex.test(normalizedTelephone)) {
            this.telephoneError = 'Format du numéro de téléphone invalide.';
        }

        if (!this.password.trim()) {
            this.passwordError = 'Mot de passe obligatoire.';
        } else if (!this.passwordRegex.test(this.password)) {
            this.passwordError = 'Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.';
        }

        if (!this.confirmPassword.trim()) {
            this.confirmPasswordError = 'Confirmation du mot de passe obligatoire.';
        } else if (this.password !== this.confirmPassword) {
            this.confirmPasswordError = 'Les mots de passe ne correspondent pas.';
        }

        this.nom = normalizedNom;
        this.prenom = normalizedPrenom;
        this.telephone = normalizedTelephone;
        this.email = normalizedEmail;

        const isValid = !this.nomError
            && !this.prenomError
            && !this.telephoneError
            && !this.emailError
            && !this.passwordError
            && !this.confirmPasswordError;

        if (!isValid) {
            this.formError = 'Merci de corriger les champs en erreur.';
        }

        return isValid;
    }

    onRegister() {
        if (!this.validateForm()) {
            return;
        }

        this.authService.register({
            nom: this.nom,
            prenom: this.prenom,
            telephone: this.telephone,
            email: this.email,
            password: this.password
        }).subscribe({
            next: (response) => {
                console.log('Inscription réussie !', response);
                
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.formError = 'Erreur lors de l\'inscription : ' + (err.error?.message || 'Erreur inconnue');
            }
        });
    }
}
