import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { PromotionsService } from '../../services/promotions.service';
import { ActivePromotions } from '../add-promotion/types/active-promotions.types';
import { PromotionsWithMessages } from './types/promotions-with-messages.types';

@Component({
  selector: 'app-active-promotions',
  standalone: true,
  imports: [],
  templateUrl: './active-promotions.component.html',
  styleUrl: './active-promotions.component.css',
})
export class ActivePromotionsComponent implements OnInit, OnDestroy {
  private readonly promotionsService = inject(PromotionsService);
  private readonly unsubscribe = new Subject<void>();
  promotions: WritableSignal<PromotionsWithMessages> = signal({
    discounts: [],
    collections: [],
    promotions: [],
  });

  deleteCollection(collectionId: number) {
    this.promotionsService
      .deleteCollection(collectionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          const newCollections = this.promotions().collections.filter(
            (collection) => collection.collectionId !== collectionId
          );
          this.promotions.set({
            discounts: this.promotions().discounts,
            collections: newCollections,
            promotions: this.promotions().promotions,
          });
        } else throw new Error();
      });
  }

  deleteDiscount(discountId: number) {
    this.promotionsService
      .deleteDiscount(discountId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          const newDiscounts = this.promotions().discounts.filter(
            (discounts) => discounts.discountId !== discountId
          );
          this.promotions.set({
            discounts: newDiscounts,
            collections: this.promotions().collections,
            promotions: this.promotions().promotions,
          });
        } else throw new Error();
      });
  }
  deletePromotion(promotionId: number) {
    this.promotionsService
      .deletePromotion(promotionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          const newPromotions = this.promotions().promotions.filter(
            (promotion) => promotion.promotionId !== promotionId
          );
          this.promotions.set({
            discounts: this.promotions().discounts,
            collections: this.promotions().collections,
            promotions: newPromotions,
          });
        } else throw new Error();
      });
  }

  ngOnInit(): void {
    const discountObservable = this.promotionsService.getActiveDiscounts();
    const collectionsObservable = this.promotionsService.getActiveCollections();
    const activePromotionsObservable =
      this.promotionsService.getActivePromotions();
    combineLatest({
      discounts: discountObservable,
      collections: collectionsObservable,
      promotions: activePromotionsObservable,
    })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ discounts, collections, promotions }) => {
        this.promotions.set({
          discounts: discounts,
          collections: collections,
          promotions: promotions,
        });
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
