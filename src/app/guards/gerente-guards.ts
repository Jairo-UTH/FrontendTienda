import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServicios } from '../servicios/auth-servicios';

export const gerenteGuard: CanActivateFn = () => {
  const authService = inject(AuthServicios);
  const router = inject(Router);

  if (authService.isGerente()) return true;

  router.navigateByUrl('/');
  return false;
};
