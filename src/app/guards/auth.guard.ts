import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem('livry_token');
  const currentRole = localStorage.getItem('userRole');
  const expectedRole = route.data['role'];

  if (!token || !currentRole) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRole) {
    const allowedRoles = Array.isArray(expectedRole) ? expectedRole : [expectedRole];
    if (!allowedRoles.includes(currentRole)) {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
