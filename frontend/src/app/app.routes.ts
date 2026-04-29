import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';
import { Forbidden } from './pages/forbidden/forbidden';
import { BookDetail } from './pages/book-detail/book-detail';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';
import { Logout } from './pages/logout/logout';
import { Reservations } from './pages/reservations/reservations';
import { LibrarianDashboard } from './pages/dashboard/libraire/librarianDashboard';
import { BookFormComponent } from './ui/components/form/book/bookForm.component';
import { AdminDashboard } from './pages/dashboard/admin/adminDashboard';

export const routes: Routes = [
    { path: "", component: Home },

    { path: "login", component: Login },
    { path: "register", component: Register },
    { path: "logout", component: Logout, canActivate: [authGuard] },
    { path: "profile", component: Profile, canActivate: [authGuard] },
    { path: "reservations", component: Reservations, canActivate: [authGuard] },
    { path: 'dashboard/librarian', component: LibrarianDashboard, canActivate: [authGuard]  },
    { path: 'api/books/create', component: BookFormComponent, canActivate: [authGuard] },
    { path: 'api/books/edit/:id', component: BookFormComponent, canActivate: [authGuard] },
    // { path: 'dashboard/admin', component: AdminDashboard, canActivate: [authGuard] }, a decommenter quand l'adminDashboard sera implementer
    { path: 'dashboard/admin', component: AdminDashboard, canActivate: [authGuard] },
    { path: "book/:id", component: BookDetail, canActivate: [authGuard] },


    { path: "forbidden", component: Forbidden },
    { path: "**", component: NotFound }
];
