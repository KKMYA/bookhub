import { Component } from '@angular/core';
import { Button } from "../../ui/components/button/button";
import { Input } from "../../ui/components/input/input";
import { PasswordInput } from "../../ui/components/input-password/input-password";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Button, Input, PasswordInput],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Connexion réussie !', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Erreur de connexion : ' + (err.error?.message || 'Identifiants incorrects'));
      }
    });
  }
}
