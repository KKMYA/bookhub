import { Component, inject, OnInit } from '@angular/core';
import { Button } from '../../ui/components/button/button';
import { PasswordInput } from '../../ui/components/input-password/input-password';
import { Input } from '../../ui/components/input/input';
import { User } from '../../models/user.model';
import { UserService } from '../../services/http/user/user.service';

@Component({
  selector: 'app-profile',
  imports: [Button, PasswordInput, Input],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private userService = inject(UserService);

  account: User = { id: 0, nom: '', prenom: '', email: '', telephone: '' };

  successMessage = '';
  errorMessage = '';

  showPasswordModal = false;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => (this.account = user),
      error: (err) => console.error('Erreur chargement profil', err),
    });
  }

  onUpdateInfo(): void {
    this.userService.updateProfile(this.account).subscribe({
      next: (updatedUser) => {
        this.account = updatedUser;
        this.successMessage = 'Informations mises à jour.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour.';
        console.error(err);
      },
    });
  }

  onUpdateEmail(): void {
    this.userService.updateProfile(this.account).subscribe({
      next: () => {
        this.successMessage = 'Email mis à jour.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de la mise à jour de l'email.";
        console.error(err);
      },
    });
  }

  openPasswordModal(): void {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  onUpdatePassword(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Tous les champs sont obligatoires.';
      return;
    }
    if (this.newPassword === this.oldPassword) {
      this.passwordError = "Le nouveau mot de passe doit être différent de l'ancien.";
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.userService.updateProfile(this.account).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe mis à jour.';
        this.errorMessage = '';
        this.closePasswordModal();
      },
      error: (err) => {
        this.passwordError = 'Ancien mot de passe incorrect.';
        console.error(err);
      },
    });
  }
}
