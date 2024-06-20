import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { AppConfig } from '../appconfig/app.config.interface';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import {
  CreateProductDTO,
  EditProductDTO,
  PaginatedListDTO,
  ProductDTO,
} from '../products/types/product.types';

@Injectable({
  providedIn: 'any',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);
  private readonly gatewayEndpoint = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gatewayEndpoint}/products`;

  getProducts(params: { [key: string]: string }) {
    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params)) {
      httpParams = httpParams.set(key, value);
    }

    return this.httpClient.get<PaginatedListDTO>(this.url, {
      params: httpParams,
    });
  }

  getProductDetail(productId: number) {
    return this.httpClient
      .get<ProductDTO>(`${this.url}/${productId}`)
      .pipe(shareReplay(1));
  }

  getUserWishlist(userId: string) {
    return this.httpClient.get<ProductDTO[]>(`${this.url}/wishlist/${userId}`);
  }

  createProduct(dto: CreateProductDTO) {
    return this.httpClient.post<boolean>(this.url, dto);
  }

  editProduct(productId: number, dto: EditProductDTO) {
    return this.httpClient.patch<boolean>(`${this.url}/${productId}`, dto);
  }

  deleteProduct(productId: number) {
    return this.httpClient.delete<boolean>(`${this.url}/${productId}`);
  }
}
