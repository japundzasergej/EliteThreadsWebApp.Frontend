import { inject, Injectable } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import { AppConfig } from '../appconfig/app.config.interface';
import { HttpClient } from '@angular/common/http';
import {
  CollectionsDTO,
  DiscountDTO,
  CreateCollectionDTO,
  CreateDiscountDTO,
  PromotionsDTO,
  CreatePromotionDTO,
} from '../types/promotions.types';

@Injectable({
  providedIn: 'root',
})
export class PromotionsService {
  private readonly config: AppConfig = inject(APP_CONFIG_SERVICE);
  private readonly url = `${this.config.gatewayEndpoint}/promotions`;
  private readonly httpClient = inject(HttpClient);

  getActiveDiscounts() {
    return this.httpClient.get<DiscountDTO[]>(`${this.url}/discounts`);
  }
  getActiveCollections() {
    return this.httpClient.get<CollectionsDTO[]>(`${this.url}/collections`);
  }
  getActivePromotions() {
    return this.httpClient.get<PromotionsDTO[]>(
      `${this.url}/promotion-messages`
    );
  }
  createCollection(dto: CreateCollectionDTO) {
    return this.httpClient.post<boolean>(`${this.url}/collections`, dto);
  }
  createDiscount(dto: CreateDiscountDTO) {
    return this.httpClient.post<boolean>(`${this.url}/discount`, dto);
  }
  createPromotion(dto: CreatePromotionDTO) {
    return this.httpClient.post(`${this.url}/promotion-messages`, dto);
  }
  addProductToCollection(productId: number, collectionId: number) {
    return this.httpClient.post<boolean>(
      `${this.url}/collections/${collectionId}/product-${productId}`,
      null
    );
  }
  deleteCollection(collectionId: number) {
    return this.httpClient.delete<boolean>(
      `${this.url}/collections/${collectionId}`
    );
  }
  removeProductFromCollection(productId: number, collectionId: number) {
    return this.httpClient.delete<boolean>(
      `${this.url}/collections/${collectionId}/product-${productId}`
    );
  }
  addDiscountToProduct(productId: number, discountId: number) {
    return this.httpClient.post<boolean>(
      `${this.url}/discount/${discountId}/product-${productId}`,
      null
    );
  }
  deleteDiscount(discountId: number) {
    return this.httpClient.delete<boolean>(
      `${this.url}/discount/${discountId}`
    );
  }
  removeDiscountFromProduct(productId: number, discountId: number) {
    return this.httpClient.delete<boolean>(
      `${this.url}/discount/${discountId}/product-${productId}`
    );
  }
  deletePromotion(promotionId: number) {
    return this.httpClient.delete(
      `${this.url}/promotion-messages/${promotionId}`
    );
  }
}
