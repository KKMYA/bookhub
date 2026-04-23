import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // On récupère le token dans le localStorage
  const token = localStorage.getItem('token');

  // Si on a un token, on fait une copie de la requête et on ajoute le badge de sécurité
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
