import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { finalize, mergeMap } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const token$ = inject(AuthService).idTokenClaims$;
  const loaderService = inject(LoaderService);
  let defaultHeaders = new HttpHeaders({
    Accept: 'application/json',
  });
  loaderService.showLoader();

  return token$.pipe(
    mergeMap((token) => {
      if (token) {
        defaultHeaders = defaultHeaders.append(
          'Authorization',
          `Bearer ${token.__raw}`
        );
      }
      return next(req.clone({ headers: defaultHeaders })).pipe(
        finalize(() => loaderService.hideLoader())
      );
    })
  );
};
