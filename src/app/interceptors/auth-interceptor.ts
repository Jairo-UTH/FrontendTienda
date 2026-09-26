import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServicios } from '../servicios/auth-servicios';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServicios);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
