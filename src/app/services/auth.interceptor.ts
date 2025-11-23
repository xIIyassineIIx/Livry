import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_WHITELIST = ['/api/users/login', '/api/users/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('livry_token');

  const shouldSkip = AUTH_WHITELIST.some((path) => req.url.includes(path));

  if (!token || shouldSkip) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};



