import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowed = (route.data?.['roles'] as Role[]) ?? [];
  const userRole = auth.role?.toLowerCase();

  const hasAccess =
    !!userRole &&
    (allowed.length === 0 ||
      allowed.some((role) => role.toLowerCase() === userRole));

  if (auth.isLoggedIn && hasAccess) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};