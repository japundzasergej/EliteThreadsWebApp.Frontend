import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { OrderService } from '../services/order.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { OrderDTO } from '../types/order.types';

@Component({
  selector: 'app-payment-successful',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './payment-successful.component.html',
  styleUrl: './payment-successful.component.css',
})
export class PaymentSuccessfulComponent implements OnInit {
  private readonly queryParams = inject(ActivatedRoute).queryParams.pipe(
    map((param) => param)
  );
  private readonly orderService = inject(OrderService);
  order$!: Observable<OrderDTO>;
  total$ = this.queryParams.pipe(map((params) => params['total']));
  ngOnInit(): void {
    this.order$ = this.queryParams.pipe(
      switchMap((params) => this.orderService.getOrder(params['orderHeaderId']))
    );
  }
}
