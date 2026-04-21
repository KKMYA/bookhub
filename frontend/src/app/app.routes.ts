import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';
import { Forbidden } from './pages/forbidden/forbidden';
import { BookDetail } from './pages/book-detail/book-detail';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    { path: "", component: Home },

    { path: "login", component: Login },
    { path: "register", component: Register },
    { path: "profile", component: Profile },

    { path: "book/:id", component: BookDetail },


    { path: "forbidden", component: Forbidden },
    { path: "**", component: NotFound }
];
