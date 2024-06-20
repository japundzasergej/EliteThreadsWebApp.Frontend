import { CollectionsDTO, DiscountDTO } from '../../../types/promotions.types';

export interface ActivePromotions {
  discounts: DiscountDTO[];
  collections: CollectionsDTO[];
}
