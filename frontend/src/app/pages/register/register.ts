import { Component } from '@angular/core';
import { Input } from "../../ui/components/input/input";
import { PasswordInput } from "../../ui/components/input-password/input-password";
import { Button } from "../../ui/components/button/button";
import { AuthService } from '../../services/auth.service';
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

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onRegister() {
        if (this.password !== this.confirmPassword) {
            alert('Les mots de passe ne correspondent pas !');
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
                alert('Erreur lors de l\'inscription : ' + (err.error?.message || 'Erreur inconnue'));
            }
        });
    }
}
