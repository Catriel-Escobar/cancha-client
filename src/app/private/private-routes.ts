import { Routes } from '@angular/router';
import { PrivateLayoutComponent } from './private-layout/private-layout.component';

export default [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard | Cancha3',
        loadComponent: () => import('./dashboard/dashboard.component'),
      },

      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
] as Routes;
