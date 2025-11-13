import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
