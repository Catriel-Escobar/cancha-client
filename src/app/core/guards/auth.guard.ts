import { effect, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/user-store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Ejecuta checkLogin y espera el resultado
  authStore.checkLogin();

  // Observa el estado isLogged
  return new Promise<boolean>((resolve) => {
    const subscription = effect(() => {
      const isLoading = authStore.isLoading();
      const isLogged = authStore.isLogged();

      // Si ya no está cargando, podemos tomar una decisión
      if (!isLoading) {
        if (!isLogged) {
          router.navigate(['/auth/login']);
        }
        resolve(isLogged);
        subscription.destroy();
      }
    });
  });
};
