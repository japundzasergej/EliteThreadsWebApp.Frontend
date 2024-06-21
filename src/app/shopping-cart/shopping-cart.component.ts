import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { SocialService } from '../services/social.service';
import { ToasterService } from '../toaster/services/toaster.service';
import {
  CartDetailDTO,
  CartDTO,
  CheckoutDTO,
  ProductDTO,
} from '../types/shopping-cart.types';
import { CartListComponent } from './cart-list/cart-list.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderSummary } from './types/order-summary.types';
import { ProductQuantity } from './types/product-quantity.types';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [SearchBarComponent, OrderSummaryComponent, CartListComponent],
  providers: [SocialService],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  private readonly userId$ = inject(ActivatedRoute).paramMap.pipe(
    map((param) => param.get('userId'))
  );
  private readonly router = inject(Router);
  private readonly shoppingCartService = inject(ShoppingCartService);
  private readonly unsubscribe = new Subject<void>();
  private readonly socialService = inject(SocialService);
  private readonly toast = inject(ToasterService);
  private userId!: string;
  private readonly cartSubject = new BehaviorSubject<CartDTO>(new CartDTO());
  private readonly cart$ = this.cartSubject.asObservable();
  cart: WritableSignal<CartDTO> = signal(new CartDTO());
  wishlistProductIds: WritableSignal<number[]> = signal([]);
  orderSummary: WritableSignal<OrderSummary> = signal({
    originalPrice: 0,
    savings: 0,
    shipping: 30,
    total: 0,
  });

  private calculateOrderSummary(
    details: CartDetailDTO[] | undefined
  ): OrderSummary {
    let originalPrice = 0;
    let savings = 0;
    let shipping = 30;

    if (details?.length) {
      for (let detail of details) {
        const product: ProductDTO = detail.product!;
        originalPrice += product.price! * detail.quantity!;
        if (product.hasDiscount) {
          savings +=
            product.price! * detail.quantity! -
            product.price! * (product.priceAfterDiscount! / 100);
        }
      }
    }

    const total = originalPrice - savings;
    if (total > 80) {
      shipping = 0;
    }
    return {
      originalPrice,
      savings,
      shipping,
      total: total + shipping,
    };
  }

  incrementQuantity(quantityObject: ProductQuantity) {
    this.cart().cartDetails = this.cart().cartDetails?.map((detail) => {
      if (detail.productId === quantityObject.productId) {
        return {
          ...detail,
          quantity: quantityObject.quantity,
        };
      }
      return detail;
    }) as CartDetailDTO[];
    this.cartSubject.next(this.cart());
  }

  decrementQuantity(quantityObject: ProductQuantity) {
    this.cart().cartDetails = this.cart().cartDetails?.map((detail) => {
      if (detail.productId === quantityObject.productId) {
        return {
          ...detail,
          quantity: quantityObject.quantity,
        };
      }
      return detail;
    }) as CartDetailDTO[];
    this.cartSubject.next(this.cart());
  }

  addProductToWishlist(productId: number) {
    this.socialService
      .addProductToWishList(this.userId, productId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Product added to wishlist!');
          this.wishlistProductIds().push(productId);
        } else throw new Error();
      });
  }

  removeProductFromWishlist(productId: number) {
    this.socialService
      .removeProductFromWishList(this.userId, productId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Product removed from wishlist.');
          this.wishlistProductIds.set(
            this.wishlistProductIds().filter((product) => productId !== product)
          );
        } else throw new Error();
      });
  }

  removeProductFromCart(cartDetailId: number) {
    this.shoppingCartService
      .removeProductFromCart(cartDetailId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Item removed from cart');
          this.cart().cartDetails = this.cart().cartDetails?.filter(
            (details) => details.cartDetailId !== cartDetailId
          );
          this.cartSubject.next(this.cart());
        }
      });
  }

  clearCart() {
    if (this.cart().cartDetails?.length) {
      this.shoppingCartService
        .clearCart(this.userId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            window.location.reload();
          } else throw new Error();
        });
    }
  }

  checkoutCart() {
    const dto = new CheckoutDTO();
    const cartDto = new CartDTO();
    cartDto.init(this.cart());
    dto.cartDTO = cartDto;
    dto.totalPrice = this.orderSummary().total;
    dto.userId = this.userId;

    let orderId = '';

    this.shoppingCartService
      .checkoutCart(dto)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          orderId = response.orderId!;
          this.shoppingCartService
            .clearCart(dto.userId!)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((response) => {
              if (response) {
                this.router.navigate(['/checkout/', orderId]);
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngOnInit(): void {
    this.userId$
      .pipe(
        switchMap((param) => {
          this.userId = param!;
          return combineLatest([
            this.shoppingCartService.getUserCart(param!),
            this.socialService.getProductsOnUserWishlist(param!),
          ]);
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([cartResponse, wishlistResponse]) => {
        this.orderSummary.set(
          this.calculateOrderSummary(cartResponse.cartDetails!)
        );
        this.cart.set(cartResponse);

        this.wishlistProductIds.set(wishlistResponse);
      });
    this.cart$.pipe(takeUntil(this.unsubscribe)).subscribe((cart) => {
      this.cart.set(cart);
      this.orderSummary.set(this.calculateOrderSummary(cart.cartDetails!));
    });
  }
}
