import { ReviewCount } from '../../review/types/review-count.types';

export interface ReviewResolve {
  reviewCount: ReviewCount;
  productId: number;
}
