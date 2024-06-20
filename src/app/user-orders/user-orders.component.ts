import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { OrderPaginatorComponent } from '../order-paginator/order-paginator.component';
import { combineLatest, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { OrderService } from '../services/order.service';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { PaginatedOrderListDTO } from '../types/order.types';
import { Pagination } from '../types/pagination.types';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ToasterService } from '../toaster/services/toaster.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    SearchBarComponent,
    OrderPaginatorComponent,
    CurrencyPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css',
})
export class UserOrdersComponent implements OnInit, OnDestroy {
  private readonly unsubscribe = new Subject<void>();
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToasterService);
  orders: WritableSignal<PaginatedOrderListDTO> = signal(
    new PaginatedOrderListDTO()
  );
  pagination: WritableSignal<Pagination> = signal({
    itemCount: 0,
    pageCount: 0,
    pageIndex: 0,
    pageSize: 10,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  cancelOrder(orderId: string) {
    this.orderService
      .cancelOrder(orderId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess(`Order with id ${orderId} cancelled`);
          window.location.reload();
        } else throw new Error();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((params: ParamMap) => {
          const page = Number(params.get('page')) || 1;
          return combineLatest([
            of(page),
            this.route.paramMap.pipe(
              map((routeParams) => routeParams.get('userId'))
            ),
          ]);
        }),
        takeUntil(this.unsubscribe),
        switchMap(([page, userId]) => {
          return this.orderService.getOrdersByUserId(userId!, page);
        })
      )
      .subscribe((orders) => {
        this.orders.set(orders);
        this.pagination.set({
          itemCount: orders.totalCount,
          pageCount: orders.totalPages,
          pageIndex: orders.pageIndex,
          pageSize: orders.pageSize,
          hasNextPage: orders.hasNextPage,
          hasPreviousPage: orders.hasPreviousPage,
        });
      });
  }
}
