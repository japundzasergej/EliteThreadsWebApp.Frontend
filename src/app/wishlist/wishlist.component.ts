import { AsyncPipe, CurrencyPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductDTO, Size } from '../products/types/product.types';
import { ProductService } from '../services/product.service';
import { SocialService } from '../services/social.service';
import { ToasterService } from '../toaster/services/toaster.service';
import { ModalService } from '../services/modal-service.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    CurrencyPipe,
    ReactiveFormsModule,
    NgClass,
    SearchBarComponent,
  ],
  providers: [ProductService, SocialService],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit, OnDestroy {
  private readonly unsubscribe = new Subject<void>();
  private readonly productService = inject(ProductService);
  private readonly socialService = inject(SocialService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToasterService);
  private readonly modalService = inject(ModalService);
  private readonly userId$ = inject(ActivatedRoute).paramMap.pipe(
    map((param) => param.get('userId'))
  );
  wishlist$!: Observable<ProductDTO[]>;

  openModal() {
    this.modalService.open();
  }

  roundDecimal(input: number) {
    return Math.round(input * 10) / 10;
  }

  removeFromWishlist(productId: number) {
    this.userId$
      .pipe(
        switchMap((userId) =>
          this.socialService.removeProductFromWishList(userId!, productId)
        )
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Product removed from your wish-list.');
          window.location.reload();
        } else {
          throw new Error();
        }
      });
  }

  calculateDiscount(price: number, discountAmount: number) {
    const discount = price * (discountAmount / 100);
    return price - discount;
  }
  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.wishlist$ = this.userId$.pipe(
            switchMap((userId) => {
              return this.productService.getUserWishlist(userId!);
            })
          );
        } else {
          this.authService.loginWithRedirect();
        }
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
