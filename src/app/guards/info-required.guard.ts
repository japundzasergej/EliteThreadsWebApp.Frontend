import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { OrderService } from '../services/order.service';
import { AuthService } from '@auth0/auth0-angular';
import { first, lastValueFrom, map, switchMap } from 'rxjs';

export const infoRequiredGuard: CanMatchFn = async (route, segments) => {
  const auth = inject(AuthService);
  const orderService = inject(OrderService);
  const userId = await lastValueFrom(
    auth.idTokenClaims$.pipe(
      first(),
      map((claims) => claims?.['sub'])
    )
  );

  const personalInfo = await lastValueFrom(
    orderService.getPersonalInfo(userId).pipe(
      first(),
      map((response) => response)
    )
  );

  return personalInfo.name &&
    personalInfo.country &&
    personalInfo.state &&
    personalInfo.city &&
    personalInfo.state
    ? true
    : false;
};
