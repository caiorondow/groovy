import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

/* 
  Interceptador: toda requisição HTTP feita passa primeiro pelo interceptador para depois ser mandada para o servidor
  O interceptador é responsável por verificar se o usuário possui um token e adicioná-lo ao Header da requisição
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    const modifiedRequest = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });

    return next(modifiedRequest);
  }
  return next(req);
};
