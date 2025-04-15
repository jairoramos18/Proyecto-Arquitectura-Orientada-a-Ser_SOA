import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => 
      import('./register/register.component').then((m) => m.RegisterComponent), 
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent), 
    canActivate: [AuthGuard], //  ruta con un AuthGuard 
  },
  {
  path: 'forgot-password',
  loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
},

  {
    path: '**',
    redirectTo: 'home',
  },
];
