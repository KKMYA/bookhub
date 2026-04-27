import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard-pivot',
  standalone: true,
  template: `<p>Redirection en cours...</p>`
})
export class DashboardPivot implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const role = this.authService.role;

    if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'LIBRARIAN') {
      this.router.navigate(['/librarian/dashboard']);
    } else {
      this.router.navigate(['/home']); // Sécurité pour les USER standards
    }
  }
}
