import { inject, Injectable } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import { HttpClient } from '@angular/common/http';
import {
  AddUpdateProductToCartDTO,
  CartDTO,
  CheckoutDTO,
  OrderPlacedDTO,
} from '../types/shopping-cart.types';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly gatewayEndpoint = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gatewayEndpoint}/shopping-cart`;
  private readonly httpClient = inject(HttpClient);

  getUserCart(userId: string) {
    return this.httpClient.get<CartDTO>(`${this.url}/${userId}`);
  }
  addUpdateProductToCart(dto: AddUpdateProductToCartDTO) {
    return this.httpClient.post<boolean>(this.url, dto);
  }
  removeProductFromCart(cartDetailId: number) {
    return this.httpClient.delete<boolean>(`${this.url}/${cartDetailId}`);
  }
  clearCart(userId: string) {
    return this.httpClient.delete<boolean>(`${this.url}/clear/${userId}`);
  }
  checkoutCart(dto: CheckoutDTO) {
    return this.httpClient.post<OrderPlacedDTO>(`${this.url}/checkout`, dto);
  }
}
