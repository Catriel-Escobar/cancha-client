import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../shared/data-access/base-http.service';
import {
  LoginResponse,
  LoginResponseByDecodedJwt,
} from '../../interfaces/response/login-response.interface';
import { LoginRequest } from '../../interfaces/request/login-request.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { RegisterResponse } from '../../interfaces/response/register-response.interface';
import { RegisterRequest } from '../../interfaces/request/register-request.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { decodedJwt } from '../../../utils/decoded0-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  login(loginRequest: LoginRequest): Observable<LoginResponseByDecodedJwt> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}login`, loginRequest)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        }),
        map((response) => {
          const payload = decodedJwt(response.token);
          if (!payload || payload === null)
            throwError(() => new Error('Error decoding token'));
          return {
            user: {
              id: payload!.id,
              email: payload!.unique_name,
              name: payload!.name,
            },
            exp: payload!.exp_milliseconds,
          };
        }),
        catchError(this.handleError)
      );
  }

  // Método de Registro para NgRx
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    console.log({ registerRequest });
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}register`, registerRequest)
      .pipe(
        map((response) => {
          console.log(response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // Verificar expiración del token
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token || token.length === 0) return true;
    try {
      const payload = decodedJwt(token);
      if (!payload || !payload.exp) return true;
      // Comparar tiempo de expiración con tiempo actual
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  isTokenRemainingTime(): boolean {
    const token = this.getToken();
    const payload = decodedJwt(token);
    return payload!.exp_milliseconds > 300000;
  }

  checkLogin(): Observable<LoginResponseByDecodedJwt> {
    return this.http.get<LoginResponse>(`${this.apiUrl}check-login`).pipe(
      tap((response) => {
        this.setToken(response.token);
      }),
      map((response) => {
        const payload = decodedJwt(response.token);
        if (!payload || payload === null)
          throwError(() => new Error('Error decoding token'));
        return {
          user: {
            id: payload!.id,
            email: payload!.unique_name,
            name: payload!.name,
          },
          exp: payload!.exp_milliseconds,
        };
      }),
      catchError(this.handleError)
    );
  }

  checkLoginByDecodedJwt(): LoginResponseByDecodedJwt | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = decodedJwt(token);
    if (!payload) return null;
    const userData: LoginResponseByDecodedJwt = {
      user: {
        id: payload.id,
        email: payload.unique_name,
        name: payload.name,
      },
      exp: payload.exp_milliseconds,
    };
    return userData;
  }

  logout(): Observable<boolean> {
    // Puedes hacer una llamada al backend si es necesario
    this.removeToken();
    return of(true);
  }

  // Manejo de errores
  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    console.log(errorRes);
    if (!errorRes.error) {
      return throwError(() => new Error(errorMessage));
    }
    if (errorRes.status === 404 || errorRes.status === 400) {
      errorMessage = 'Credenciales incorrectas';
    }
    return throwError(() => new Error(errorMessage));
  }

  // Aquí asumes que el token se guarda en el localStorage, pero esto puede ser diferente según tu implementación
  getToken(): string {
    return localStorage.getItem('authToken') ?? '';
  }

  // Método para guardar el token en localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para eliminar el token
  removeToken(): void {
    localStorage.removeItem('authToken');
  }
}
