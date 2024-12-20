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
import { LoginResponseByDecodedJwt } from '../../../interfaces/response/login-response.interface';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  isLogged: boolean;
  exp: number;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
  isLogged: false,
  exp: 0,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),
  withComputed((state) => ({
    currentUser: computed(() => state.user()),
    isLoading: computed(() => state.loading()),
    currentError: computed(() => state.error()),
    currentMessage: computed(() => state.message()),
    currentIsLogged: computed(() => state.isLogged()),
    currentExp: computed(() => state.exp()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    // Método de login (como el anterior)
    login(loginRequest: LoginRequest) {
      patchState(store, { loading: true, error: null, message: null });

      authService.login(loginRequest).subscribe({
        next: ({ user, exp }) => {
          patchState(store, {
            user,
            loading: false,
            isLogged: true,
            exp,
          });
        },
        error: (error) => {
          console.log(error);
          patchState(store, {
            loading: false,
            error: error.message || 'Login failed',
            user: null,
            isLogged: false,
          });
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
      patchState(store, { loading: true });

      if (authService.isTokenExpired()) {
        this._handleSessionExpired();
        return;
      }

      if (authService.isTokenRemainingTime()) {
        const result = authService.checkLoginByDecodedJwt();
        if (!result) {
          this._handleSessionInvalid();
        } else {
          this._handleSessionValid(result);
        }
        return;
      }

      authService.checkLogin().subscribe({
        next: (res) => {
          this._handleSessionValid(res);
        },
        error: (error) => {
          this._handleSessionError(
            error.message ?? 'Error al verificar la sesión'
          );
        },
      });
    },

    _handleSessionExpired() {
      authService.removeToken();
      patchState(store, {
        user: null,
        loading: false,
        isLogged: false,
      });
    },

    // Función para manejar sesiones inválidas
    _handleSessionInvalid() {
      patchState(store, {
        user: null,
        loading: false,
        isLogged: false,
      });
    },

    // Función para manejar sesiones válidas
    _handleSessionValid(res: LoginResponseByDecodedJwt) {
      patchState(store, {
        user: res.user,
        message: null,
        error: null,
        isLogged: true,
        loading: false,
        exp: res.exp,
      });
    },

    // Función para manejar errores al verificar la sesión
    _handleSessionError(error: string) {
      authService.removeToken();
      patchState(store, {
        loading: false,
        user: null,
        message: null,
        error,
        isLogged: false,
      });
    },
    clearErrors() {
      patchState(store, { error: null });
    },

    clearMessages() {
      patchState(store, { message: null });
    },
  }))
);
