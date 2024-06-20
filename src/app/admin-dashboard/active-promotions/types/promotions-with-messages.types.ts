import { CollectionsDTO, DiscountDTO, PromotionsDTO } from "../../../types/promotions.types";

export interface PromotionsWithMessages {
  discounts: DiscountDTO[];
  collections: CollectionsDTO[];
  promotions: PromotionsDTO[]
}