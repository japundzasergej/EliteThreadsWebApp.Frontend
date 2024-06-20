import { inject, Injectable, OnInit } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import {
  ProductRatingDTO,
  UpdatePasswordDTO,
  UserRatingDTO,
} from '../types/social.types';
import {
  CreateReviewsDTO,
  EditReviewDTO,
  ReviewsDTO,
  UserDTO,
} from '../types/social.types';

@Injectable({
  providedIn: 'any',
})
export class SocialService {
  private readonly gatewayEndpoint = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gatewayEndpoint}/social`;
  private readonly httpClient = inject(HttpClient);
  getReviewsByProductId(productId: number) {
    return this.httpClient
      .get<ReviewsDTO[]>(`${this.url}/reviews/${productId}`)
      .pipe(shareReplay(1));
  }
  getReviewByReviewId(reviewId: number) {
    return this.httpClient.get<ReviewsDTO>(
      `${this.url}/reviews/edit/${reviewId}`
    );
  }
  getRatingsByProductId(productId: number) {
    return this.httpClient.get<ProductRatingDTO>(
      `${this.url}/reviews/ratings/${productId}`
    );
  }
  getUserRating(productId: number, userId: string) {
    return this.httpClient.get<UserRatingDTO | undefined>(
      `${this.url}/reviews/rating/${userId}/product-${productId}`
    );
  }
  createReview(productId: number, dto: CreateReviewsDTO) {
    return this.httpClient.post<boolean>(
      `${this.url}/reviews/${productId}`,
      dto
    );
  }
  updateProductRating(dto: UserRatingDTO) {
    return this.httpClient.post<boolean>(`${this.url}/reviews/add-rating`, dto);
  }
  editReview(reviewId: number, dto: EditReviewDTO) {
    return this.httpClient.put<boolean>(`${this.url}/reviews/${reviewId}`, dto);
  }
  deleteReview(reviewId: number) {
    return this.httpClient.delete<boolean>(`${this.url}/reviews/${reviewId}`);
  }
  getUser(userId: string) {
    return this.httpClient.get<UserDTO>(`${this.url}/user/${userId}`);
  }
  updateUser(userId: string, dto: UserDTO) {
    return this.httpClient.patch<boolean>(`${this.url}/user/${userId}`, dto);
  }
  updateUserPassword(userId: string, dto: UpdatePasswordDTO) {
    return this.httpClient.patch<boolean>(
      `${this.url}/user/password/${userId}`,
      dto
    );
  }
  deleteUser(userId: string) {
    return this.httpClient.delete<boolean>(`${this.url}/user/${userId}`);
  }
  getProductsOnUserWishlist(userId: string) {
    return this.httpClient.get<number[]>(`${this.url}/user/wishlist/${userId}`);
  }
  addProductToWishList(userId: string, productId: number) {
    return this.httpClient.post<boolean>(
      `${this.url}/user/wishlist/${userId}/${productId}`,
      null
    );
  }
  removeProductFromWishList(userId: string, productId: number) {
    return this.httpClient.delete<boolean>(
      `${this.url}/user/wishlist/${userId}/${productId}`
    );
  }
}
