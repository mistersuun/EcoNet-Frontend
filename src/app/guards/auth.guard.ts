import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  // Not authenticated, redirect to login
  console.log('Access denied. Redirecting to login...');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
