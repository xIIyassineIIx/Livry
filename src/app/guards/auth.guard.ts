import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Role required for this route
  const expectedRole = route.data['role'] as string;

  // Get role from localStorage
  const currentRole = localStorage.getItem('userRole');

  if (!currentRole) {
    // Not logged in
    router.navigate(['/login']);
    return false;
  }

  if (expectedRole && currentRole !== expectedRole) {
    // Role does not match
    router.navigate(['/login']);
    return false;
  }


  // Logged in and role matches
  return true;
};
