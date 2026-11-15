import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Solo deja entrar al panel si hay una sesión iniciada; si no, lleva al login */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.autenticado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], { queryParams: { volver: state.url } });
};
