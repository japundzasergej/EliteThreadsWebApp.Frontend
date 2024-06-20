import { Injectable, signal, WritableSignal } from '@angular/core';
import { ReviewCount } from '../review/types/review-count.types';
import { ReviewResolve } from './types/review-resolve.types';

@Injectable({
  providedIn: 'root',
})
export class RatingResolveService {
  private readonly rating: WritableSignal<ReviewResolve> = signal({
    reviewCount: {
      avgRating: 0,
      totalRatings: 0,
      ratingCount: [],
    },
    productId: 0,
  });

  returnRating() {
    return this.rating();
  }
  setRating(rating: ReviewResolve) {
    this.rating.set(rating);
  }
  pushObject([...numbers]: number[]) {
    for (let number of numbers) {
      this.rating().reviewCount.ratingCount.push(number);
    }
  }
}
