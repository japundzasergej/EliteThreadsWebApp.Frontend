import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderSummary } from '../types/order-summary.types';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CurrencyPipe, NgClass, RouterLink],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
})
export class OrderSummaryComponent {
  @Input() orderSummary!: OrderSummary;
  @Output() cartCleared = new EventEmitter<void>();
  @Output() cartCheckedOut = new EventEmitter<void>();

  clearCart() {
    this.cartCleared.emit();
  }
  checkoutCart() {
    this.cartCheckedOut.emit();
  }
}
