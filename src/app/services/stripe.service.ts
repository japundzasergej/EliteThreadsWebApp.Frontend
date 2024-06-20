import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import { OrderDTO } from '../types/order.types';
import { StripeCheckoutResponse } from '../types/payment.types';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private readonly gatewayEndpoint = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gatewayEndpoint}/checkout`;
  private readonly httpClient = inject(HttpClient);

  getSessionId(dto: OrderDTO) {
    return this.httpClient.post<StripeCheckoutResponse>(this.url, dto);
  }
}
