import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginRedirectGuard } from './guards/login-redirect-guard.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/login/login.component'),
        canActivate: [LoginRedirectGuard],
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register-form/register-form.component'),
        canActivate: [LoginRedirectGuard],
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/posts/posts.component'),
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        redirectTo: ''
    }
];
