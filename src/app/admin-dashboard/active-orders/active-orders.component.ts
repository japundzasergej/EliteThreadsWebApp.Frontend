import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './active-orders.component.html',
  styleUrl: './active-orders.component.css'
})
export class ActiveOrdersComponent {
 order$ = inject(OrderService).getPaidOrders();
}
