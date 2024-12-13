import { computed, inject } from '@angular/core';
import { User } from '../../../models/user.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { LoginRequest } from '../../../interfaces/request/login-request.interface';
import { RegisterRequest } from '../../../interfaces/request/register-request.interface';

import { AuthService } from '../../services/auth.service';
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};
export const UserStore = signalStore(
  // 👇 Providing `UserStore` at the root level.
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    userName: computed(() => user?.name),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    // Método de login (como el anterior)
    login(loginRequest: LoginRequest) {
      patchState(store, (state) => ({ loading: true }));

      authService.login(loginRequest).subscribe({
        next: (response) => {
          patchState(store, (state) => ({
            user: response.user,
            loading: false,
          }));
        },
        error: (err) => {
          patchState(store, (state) => ({
            loading: false,
            error: err.message || 'Login failed',
          }));
        },
      });
    },

    // Nuevo método de registro
    register(registerRequest: RegisterRequest) {
      // Establecer estado de carga
      patchState(store, (state) => ({ loading: true }));

      // Asumo que tienes un método similar en tu AuthService
      authService.register(registerRequest).subscribe({
        next: ({ response }) => {
          // Actualizar estado tras registro exitoso
          patchState(store, (state) => ({ loading: false, message: response }));
        },
        error: (err) => {
          patchState(store, (state) => ({
            loading: false,
            error: err.message || 'Register failed',
          }));
        },
      });
    },

    logout() {
      patchState(store, (state) => ({ loading: true }));
      authService.logout().subscribe({
        next: () => {
          patchState(store, (state) => ({
            loading: false,
            message: 'Hasta luego 😁',
            user: null,
          }));
        },
        error: (err) => {
          patchState(store, (state) => ({
            loading: false,
            error: 'Hubo un error al desloguear',
          }));
        },
      });
    },
    checkLogin() {
      // Establece estado de carga
      patchState(store, { loading: true });

      // Verificar si el token está expirado
      const isTokenExpired = authService.isTokenExpired();

      if (isTokenExpired) {
        // Si el token está expirado, limpiar estado
        patchState(store, {
          user: null,
          message: 'No hay una sesión iniciada',
          loading: false,
        });
        authService.removeToken();
      } else {
        // Si el token no está expirado, verificar login en el backend
        authService.checkLogin().subscribe({
          next: ({ token, user }) => {
            // Token válido, guardar token y actualizar estado
            authService.setToken(token);
            patchState(store, {
              loading: false,
              user,
              message: null,
              error: null,
            });
          },
          error: (error) => {
            // Error al verificar, limpiar token y estado
            authService.removeToken();
            patchState(store, {
              loading: false,
              user: null,
              message: null,
              error: error.message ?? 'Error al verificar la sesión',
            });
          },
        });
      }
    },
  }))
);
