import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';

/**
 * Restricts a route to specific roles.
 * Usage in routes: { canActivate: [roleGuard], data: { roles: ['Admin'] } }
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowed = (route.data?.['roles'] as Role[]) ?? [];
  if (auth.isLoggedIn && (allowed.length === 0 || auth.hasRole(...allowed))) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
