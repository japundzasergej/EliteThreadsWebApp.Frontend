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
  ParamMap,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { ModalService } from '../services/modal-service.service';
import { ProductService } from '../services/product.service';
import { subcategories, SubContent } from '../types/categories.types';
import { Pagination } from '../types/pagination.types';
import { FilterComponent } from './filter/filter.component';
import { MinMax } from './filter/types/min-max.types';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDTO } from './types/product.types';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { SocialService } from '../services/social.service';
import { ToasterService } from '../toaster/services/toaster.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    RouterOutlet,
    ProductsListComponent,
    FilterComponent,
    AsyncPipe,
  ],
  providers: [ModalService, ProductService, SocialService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly toast = inject(ToasterService);
  private readonly socialService = inject(SocialService);
  private readonly authService = inject(AuthService);
  private readonly unsubscribe = new Subject<void>();
  private readonly modalService = inject(ModalService);
  private readonly userId$: Observable<string | undefined> = inject(
    AuthService
  ).idTokenClaims$.pipe(map((token) => token?.['sub']));
  private  isAuthenticated = false;
  modal$ = this.modalService.modal$;
  subcategories = subcategories;
  productsList: WritableSignal<ProductDTO[]> = signal([]);
  wishlistProductIds: WritableSignal<number[]> = signal([]);
  isFiltersOpen = false;
  minMax: WritableSignal<MinMax> = signal({
    minPrice: 0,
    maxPrice: 0,
  });
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
    this.modalService.closeReview();
  }

  toggleFiltersOpen() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }
  clearFilters() {
    this.isFiltersOpen = false;
    const currentQueryParams = { ...this.route.snapshot.queryParams };

    delete currentQueryParams['size'];
    delete currentQueryParams['color'];
    delete currentQueryParams['composition'];
    delete currentQueryParams['priceMin'];
    delete currentQueryParams['priceMax'];
    delete currentQueryParams['orderBy'];

    this.router.navigate([], {
      queryParams: currentQueryParams,
    });
  }
  clearQuery() {
    this.router.navigate([], {
      queryParams: {},
    });
  }

  addToWishList(productId: number) {
    this.userId$
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((userId) =>
          this.socialService.addProductToWishList(userId!, productId)
        )
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Added product to user wish-list.');
          this.wishlistProductIds().push(productId);
        } else {
          throw new Error();
        }
      });
  }
  removeFromWishlist(productId: number) {
    this.userId$
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((userId) =>
          this.socialService.removeProductFromWishList(userId!, productId)
        )
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Removed product from user wish-list.');
          const index = this.wishlistProductIds().findIndex(
            (product) => product === productId
          );
          if (index !== -1) {
            this.wishlistProductIds().splice(index, 1);
          }
        } else {
          throw new Error();
        }
      });
  }

  @Memoize()
  filterSubcategories(categoryName: string): SubContent {
    const subcategoryArray = subcategories.find(
      (sub) => sub.categoryName == categoryName
    );
    return {
      subcategoryNames: subcategoryArray?.subcategoryNames ?? [],
      images: subcategoryArray?.images ?? [],
    };
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modalService.close();
    this.modalService.closeReview();
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
      .subscribe((products) => {
        this.productsList.set(products.items!);
        let prices: any[] = products.items?.map((product) => product.price)!;

        this.minMax.set({
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
        });
        this.pagination.set({
          itemCount: products.totalCount,
          pageCount: products.totalPages,
          pageIndex: products.pageIndex,
          pageSize: products.pageSize,
          hasNextPage: products.hasNextPage,
          hasPreviousPage: products.hasPreviousPage,
        });
      });
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
    if (this.isAuthenticated) {
      this.userId$
        .pipe(
          takeUntil(this.unsubscribe),
          switchMap((userId) =>
            this.socialService.getProductsOnUserWishlist(userId!)
          )
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => this.wishlistProductIds.set(response));
    }
  }
}
