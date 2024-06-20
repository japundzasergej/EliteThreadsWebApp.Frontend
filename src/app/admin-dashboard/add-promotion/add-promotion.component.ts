import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivePromotions } from './types/active-promotions.types';
import { combineLatest, forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { PromotionsService } from '../../services/promotions.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToasterService } from '../../toaster/services/toaster.service';

@Component({
  selector: 'app-add-promotion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-promotion.component.html',
  styleUrl: './add-promotion.component.css',
})
export class AddPromotionComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly promotionsService = inject(PromotionsService);
  private readonly toastService = inject(ToasterService);
  private readonly unsubscribe = new Subject<void>();
  promotions: WritableSignal<ActivePromotions> = signal({
    discounts: [],
    collections: [],
  });
  discountGroup = this.fb.group({
    discountId: [null],
  });
  collectionGroup = this.fb.group({
    collectionId: [null],
  });

  handleDiscountSubmit(e: Event) {
    e.preventDefault();
    this.route.paramMap
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((param) => {
          const productId = param.get('productId');
          return this.promotionsService.addDiscountToProduct(
            Number(productId),
            this.discountGroup.controls['discountId'].value!
          );
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toastService.showToastSuccess('Added discount to product.');
        }
      });
  }
  handleCollectionSubmit(e: Event) {
    e.preventDefault();
    this.route.paramMap
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((param) => {
          const productId = param.get('productId');
          return this.promotionsService.addProductToCollection(
            Number(productId),
            this.collectionGroup.controls['collectionId'].value!
          );
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toastService.showToastSuccess('Added product to collection.');
        }
      });
  }

  ngOnInit(): void {
    const discountsObservable = this.promotionsService.getActiveDiscounts();
    const collectionsObservable = this.promotionsService.getActiveCollections();
    combineLatest({
      discounts: discountsObservable,
      collections: collectionsObservable,
    })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((responses) => {
        this.promotions.set({
          discounts: responses.discounts,
          collections: responses.collections,
        });
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    window.location.reload();
  }
}
