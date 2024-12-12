import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

export default [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component'),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component'),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
] as Routes;
