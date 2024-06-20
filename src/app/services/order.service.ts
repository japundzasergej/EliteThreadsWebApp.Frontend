import { inject, Injectable } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  OrderDTO,
  PaginatedOrderListDTO,
  PersonalInfoDTO,
} from '../types/order.types';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly gatewayEndpoint = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gatewayEndpoint}/orders`;
  private readonly httpClient = inject(HttpClient);

  getPaidOrders(page?: number) {
    let params = new HttpParams();
    params = params.set('page', page || 1);
    return this.httpClient.get<PaginatedOrderListDTO>(this.url, {
      params,
    });
  }
  getOrdersByUserId(userId: string, page?: number) {
    let params = new HttpParams();
    params = params.set('page', page || 1);
    return this.httpClient.get<PaginatedOrderListDTO>(
      `${this.url}/user-list/${userId}`,
      {
        params,
      }
    );
  }
  getOrder(orderHeaderId: string) {
    return this.httpClient.get<OrderDTO>(`${this.url}/${orderHeaderId}`);
  }
  getPersonalInfo(userId: string) {
    return this.httpClient.get<PersonalInfoDTO>(
      `${this.url}/personal-info/${userId}`
    );
  }
  cancelOrder(orderHeaderId: string) {
    return this.httpClient.post<boolean>(
      `${this.url}/cancel/${orderHeaderId}`,
      null
    );
  }
  updatePersonalInfo(dto: PersonalInfoDTO) {
    return this.httpClient.patch<boolean>(`${this.url}/personal-info`, dto);
  }
}
