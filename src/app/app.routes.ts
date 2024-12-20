import { Routes } from '@angular/router';
import { publicGuard } from './core/guards/public.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('../app/public/auth/auth.routes'),
  },
  {
    path: 'private',
    canActivate: [authGuard],
    loadChildren: () => import('../app/private/private-routes'),
  },
];
