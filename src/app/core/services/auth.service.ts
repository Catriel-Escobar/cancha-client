import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../shared/data-access/base-http.service';
import { LoginResponse } from '../../interfaces/response/login-response.interface';
import { LoginRequest } from '../../interfaces/request/login-request.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { RegisterResponse } from '../../interfaces/response/register-response.interface';
import { RegisterRequest } from '../../interfaces/request/register-request.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { decodedJwt } from '../../../utils/decoded0-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      .pipe(
        map((response) => ({
          user: response.user,
          token: response.token,
        })),
        catchError(this.handleError)
      );
  }

  // Método de Registro para NgRx
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/auth/register`, registerRequest)
      .pipe(
        map((response) => ({
          response: response.response,
        })),
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

  checkLogin(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/auth/check-login`).pipe(
      map(({ token, user }) => ({
        user,
        token,
      })),
      catchError(this.handleError)
    );
  }

  logout(): Observable<boolean> {
    // Puedes hacer una llamada al backend si es necesario
    return of(true);
  }

  // Manejo de errores
  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Este correo ya está registrado';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Correo no encontrado';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Contraseña incorrecta';
        break;
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
