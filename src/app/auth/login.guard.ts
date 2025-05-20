import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const isUsuariosRoute = state.url.startsWith('/blackcat/usuarios');
  const isDashboardRoute = state.url.startsWith('/blackcat/dashboard');

const hasPermission = loginService.hasPermission('COORD') || loginService.hasPermission('black-cat-role');

if (!hasPermission && (isUsuariosRoute || isDashboardRoute)) {
  router.navigate(['invalid-access']);
  return false;
}
return true;

};
