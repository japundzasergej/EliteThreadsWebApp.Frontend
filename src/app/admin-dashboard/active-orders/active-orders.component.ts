import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderPaginatorComponent } from '../../order-paginator/order-paginator.component';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, OrderPaginatorComponent],
  templateUrl: './active-orders.component.html',
  styleUrl: './active-orders.component.css'
})
export class ActiveOrdersComponent {
 order$ = inject(OrderService).getPaidOrders();
}
