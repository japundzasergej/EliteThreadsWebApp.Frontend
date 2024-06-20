import { Injectable, signal, WritableSignal } from '@angular/core';
import { ReviewsDTO } from '../../../../types/social.types';

@Injectable({
  providedIn: 'root',
})
export class EditReviewResolveService {
  private readonly review: WritableSignal<ReviewsDTO> = signal(
    new ReviewsDTO()
  );
  private  productId!: number;

  setReview(dto: ReviewsDTO) {
    this.review.set(dto);
  }
  getReview() {
    return this.review();
  }
  setProductId(productId: number) {
    this.productId = productId;
  }
  getProductId() {
    return this.productId;
  }
}
