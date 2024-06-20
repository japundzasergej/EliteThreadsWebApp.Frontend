import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { first, lastValueFrom, map, take } from 'rxjs';

export const roleGuard: CanMatchFn = async (route, segments) => {
  const auth = inject(AuthService);
  const claims = await lastValueFrom(
    auth.idTokenClaims$.pipe(
      take(1),
      map((claims) => claims)
    )
  );

  return (claims?.['userRoles'] as string[])?.includes('Admin') ?? false;
};
