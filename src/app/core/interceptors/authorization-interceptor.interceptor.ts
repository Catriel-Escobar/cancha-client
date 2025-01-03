import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authorizationInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    });

    return next(clonedRequest);
  }
  return next(req);
};
