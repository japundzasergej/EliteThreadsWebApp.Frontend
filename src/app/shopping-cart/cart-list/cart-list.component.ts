import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CartDetailDTO, CartDTO } from '../../types/shopping-cart.types';
import { ProductQuantity } from '../types/product-quantity.types';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.css',
})
export class CartListComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  @Input() cart!: CartDTO;
  @Input() wishlistProductIds!: number[];
  @Output() addedToWishlist = new EventEmitter<number>();
  @Output() removedFromWishlist = new EventEmitter<number>();
  @Output() removedFromCart = new EventEmitter<number>();
  @Output() incrementedQuantity = new EventEmitter<ProductQuantity>();
  @Output() decrementedQuantity = new EventEmitter<ProductQuantity>();

  incrementQuantity(quantityObject: ProductQuantity) {
    if (quantityObject.quantity < 5) {
      quantityObject.quantity++;
    }
    this.incrementedQuantity.emit(quantityObject);
    this.cdr.detectChanges();
  }
  decrementQuantity(quantityObject: ProductQuantity) {
    if (quantityObject.quantity > 1) {
      quantityObject.quantity--;
    }
    this.decrementedQuantity.emit(quantityObject);
    this.cdr.detectChanges();
  }

  addToWishlist(productId: number) {
    this.addedToWishlist.emit(productId);
    this.cdr.detectChanges();
  }
  removeFromWishlist(productId: number) {
    this.removedFromWishlist.emit(productId);
    this.cdr.detectChanges();
  }
  removeFromCart(cartDetailId: number) {
    this.removedFromCart.emit(cartDetailId);
    this.cdr.detectChanges();
  }
  isOnWishlist(productId: number) {
    return this.wishlistProductIds.includes(productId);
  }
}
