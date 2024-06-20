import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  ActivatedRoute,
  NavigationExtras,
  ParamMap,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ProductDTO } from '../products/types/product.types';
import { ModalService } from '../services/modal-service.service';
import { ProductService } from '../services/product.service';
import { Pagination } from '../types/pagination.types';
import { ProductTableComponent } from './product-table/product-table.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    ProductTableComponent,
    AsyncPipe,
  ],
  providers: [ProductService, ModalService],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly modalService = inject(ModalService);
  private readonly unsubscribe = new Subject<void>();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  modal$ = this.modalService.modal$;
  productsList: WritableSignal<ProductDTO[]> = signal([]);
  pagination: WritableSignal<Pagination> = signal({
    itemCount: 0,
    pageCount: 0,
    pageIndex: 0,
    pageSize: 10,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  openModal() {
    this.modalService.open();
  }

  closeModal() {
    this.modalService.close();
  }

  appendSorting(value: string) {
    this.route.queryParamMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        const paramsObject: { [key: string]: string } = {};
        params.keys.forEach(
          (key) => (paramsObject[key] = params.get(key) || '')
        );

        paramsObject['orderBy'] = value;

        this.router.navigate([], { queryParams: paramsObject });
      });
  }

  deleteQueryParams() {
    this.router.navigate([], {
      queryParams: {},
    });
  }

  updateProducts(productId: number) {
    this.productsList.set(
      this.productsList().filter((item) => item.productId !== productId)
    );
  }
  searchProducts(value: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { search: value },
    };
    this.router.navigate([''], navigationExtras);
  }
  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((params: ParamMap) => {
          const queryParams: { [key: string]: string } = {};
          params.keys.forEach((key) => {
            queryParams[key] = params.get(key) || '';
          });
          return this.productService.getProducts(queryParams);
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((productList) => {
        this.productsList.set(productList.items!);
        this.pagination.set({
          itemCount: productList.totalCount,
          pageCount: productList.totalPages,
          pageIndex: productList.pageIndex,
          pageSize: productList.pageSize,
          hasNextPage: productList.hasNextPage,
          hasPreviousPage: productList.hasPreviousPage,
        });
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modalService.close();
  }
}
