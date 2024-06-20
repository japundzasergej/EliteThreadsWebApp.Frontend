import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { GeoLocation } from '../banner/types/geolocation.types';
import { APP_CONFIG_SERVICE } from '../../appconfig/app.config.service';

@Injectable({
  providedIn: 'any',
})
export class GeolocationService {
  private readonly httpClient = inject(HttpClient);
  private readonly gateway = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gateway}/geolocation`;

  getUserCountryInfo(): Observable<GeoLocation> {
    return this.httpClient.get<GeoLocation>(this.url);
  }
}
