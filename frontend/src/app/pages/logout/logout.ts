import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-logout',
    standalone: true,
    template: ''
})
export class Logout {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        this.authService.logout();
        this.router.navigateByUrl('/', { replaceUrl: true });
    }
}
