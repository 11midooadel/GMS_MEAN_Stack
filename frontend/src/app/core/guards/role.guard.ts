import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return checkRoleAccess(route, this.authService, this.router);
  }
}

// Functional guard export for Angular 15+
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return checkRoleAccess(route, authService, router);
};

function checkRoleAccess(route: ActivatedRouteSnapshot, authService: AuthService, router: Router): boolean {
  if (!authService.isLoggedIn) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRoles: string[] = route.data?.['roles'] || [];
  const currentRole = authService.role?.toString().toLowerCase().replace(/\s+/g, '_');

  if (expectedRoles.length === 0) return true;

  const isAuthorized = expectedRoles.some(
    (r) => r.toString().toLowerCase().replace(/\s+/g, '_') === currentRole
  );

  if (isAuthorized) return true;

  router.navigate(['/workouts']);
  return false;
}