import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductDTO } from '../../products/types/product.types';
import { ModalService } from '../../services/modal-service.service';
import { ProductService } from '../../services/product.service';
import { PromotionsService } from '../../services/promotions.service';
import { ToasterService } from '../../toaster/services/toaster.service';
import { Pagination } from '../../types/pagination.types';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css',
})
export class ProductTableComponent implements OnDestroy {
  @Input() products: ProductDTO[] = [];
  @Input() pagination!: Pagination;
  @Output() productChange = new EventEmitter<number>();
  @Output() clearFilters = new EventEmitter<void>();

  private readonly unsubscribe = new Subject<void>();
  private readonly productService = inject(ProductService);
  private readonly promotionService = inject(PromotionsService);
  private readonly toastService = inject(ToasterService);
  private readonly modalService = inject(ModalService);

  openModal() {
    this.modalService.open();
  }
  clear() {
    this.clearFilters.emit();
  }
  deleteProduct(productId: number) {
    let result = false;
    this.productService
      .deleteProduct(productId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        result = response;
        if (!result) {
          throw new Error();
        }
      });

    this.productChange.emit(productId);
  }
  removeDiscount(productId: number, discountId: number) {
    this.promotionService
      .removeDiscountFromProduct(productId, discountId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toastService.showToastSuccess(
            `Discount with id: ${discountId}, successfully removed from product.`
          );
          window.location.reload();
        } else throw new Error();
      });
  }
  removeProductFromcollection(productId: number, collectionId: number) {
    this.promotionService
      .removeProductFromCollection(productId, collectionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toastService.showToastSuccess(
            `Collection with id: ${collectionId}, successfully removed from product.`
          );
          window.location.reload();
        } else throw new Error();
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
