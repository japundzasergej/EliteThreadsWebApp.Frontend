import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import { CountryDTO, StateDTO } from '../types/city-state-country.types';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryCityStateService {
  private readonly httpClient = inject(HttpClient);
  private readonly gatewayEndpoint = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gatewayEndpoint}`;

  getCountries() {
    return this.httpClient
      .get<CountryDTO[]>(`${this.url}/countries`)
      .pipe(shareReplay(1));
  }
  getStates(country: string) {
    return this.httpClient
      .get<StateDTO[]>(`${this.url}/states/${country}`)
      .pipe(shareReplay(1));
  }
  getCities(state: string) {
    return this.httpClient
      .get<CountryDTO[]>(`${this.url}/cities/${state}`)
      .pipe(shareReplay(1));
  }
}
