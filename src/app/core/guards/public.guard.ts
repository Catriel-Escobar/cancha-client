import { effect, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/user-store/auth.store';

export const publicGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  authStore.checkLogin();

  return new Promise<boolean>((resolve) => {
    const subscription = effect(() => {
      const isLoading = authStore.isLoading();
      const isLogged = authStore.isLogged();

      if (!isLoading) {
        if (isLogged) {
          router.navigate(['/private/dashboard']);
        }
        resolve(!isLogged);
        subscription.destroy();
      }
    });
  });
};
