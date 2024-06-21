import {
  AsyncPipe,
  CurrencyPipe,
  KeyValuePipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {
  combineLatest,
  forkJoin,
  map,
  mergeMap,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CarouselComponent } from '../../carousel/carousel.component';
import { EnumPipe } from '../../pipes/enum.pipe';
import { ProductService } from '../../services/product.service';
import { SocialService } from '../../services/social.service';
import { ColorMap } from '../products-list/types/colorMap.types';
import { ProductDTO, Size } from '../types/product.types';
import { ReviewComponent } from './review/review.component';
import { RatingResolveService } from './services/rating-resolve.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal-service.service';
import { AuthService } from '@auth0/auth0-angular';
import { AddUpdateProductToCartDTO } from '../../types/shopping-cart.types';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ToasterService } from '../../toaster/services/toaster.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CarouselComponent,
    EnumPipe,
    ReviewComponent,
    CurrencyPipe,
    KeyValuePipe,
    NgClass,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
  ],
  providers: [ProductService],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly ratingService = inject(RatingResolveService);
  private readonly socialService = inject(SocialService);
  private readonly shoppingCartService = inject(ShoppingCartService);
  private readonly toast = inject(ToasterService);
  private readonly unsubscribe = new Subject<void>();
  private readonly modalService = inject(ModalService);
  private readonly userId$ = inject(AuthService).idTokenClaims$.pipe(
    map((token) => token?.['sub'])
  );
  private readonly routeParam$ = this.route.paramMap.pipe(
    map((param) => Number(param.get('productId') ?? 0))
  );
  userId: string | undefined;
  productId = 0;
  quantity = new FormControl<number>(1);
  showReviews$ = this.modalService.review$;
  product: WritableSignal<ProductDTO> = signal(new ProductDTO());
  images: Array<{ url: string }> = [];
  colors: ColorMap = {
    Orange: 'bg-orange-700',
    Yellow: 'bg-yellow-700',
    Red: 'bg-red-700',
    Pink: 'bg-pink-700',
    Cream: 'bg-warmGray-200',
    Grey: 'bg-gray-700',
    Green: 'bg-green-700',
    Black: 'bg-black',
    Brown: 'bg-amber-700',
    Beige: 'bg-warmGray-100',
    White: 'bg-white',
    Blue: 'bg-blue-700',
  };
  activeColor: WritableSignal<string> = signal('');
  activeSize: WritableSignal<number> = signal(0);
  size = Size;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  itemsInStock: number[] = [];
  get priceAfterDiscount() {
    return this.calculateDiscount();
  }

  openReviews() {
    this.modalService.openReview();
  }

  closeReviews() {
    this.modalService.closeReview();
  }

  activateColor(input: string) {
    this.activeColor.set(input);
  }
  activateSize(input: number) {
    this.activeSize.set(input);
  }
  calculateDiscount() {
    const discount =
      this.product().price! * (this.product().discountAmount! / 100);
    const finalPrice = this.product().price! - discount;
    return finalPrice;
  }
  handleSubmit() {
    const dto = new AddUpdateProductToCartDTO();
    dto.productId = this.productId;
    dto.userId = this.userId;
    dto.quantity = this.quantity.value!;
    dto.selectedColor = this.activeColor();
    dto.selectedSize = this.activeSize();
    this.shoppingCartService
      .addUpdateProductToCart(dto)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Product added to cart! ');
        } else throw new Error();
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modalService.close();
  }
  ngOnInit(): void {
    this.routeParam$
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((param) => {
          this.productId = param;
          return combineLatest({
            productDetails: this.productService.getProductDetail(param),
            ratings: this.socialService.getRatingsByProductId(param),
          });
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ productDetails, ratings }) => {
        this.product.set(productDetails);
        for (let image of productDetails.imageList!) {
          this.images.push({ url: image });
        }
        if(productDetails.productsLeft! >= 5) {
           this.itemsInStock = Array.from(
            { length: 5 },
            (_, i) => i + 1
          );
        }else {
          this.itemsInStock = Array.from(
            { length: productDetails.productsLeft! },
            (_, i) => i + 1
          );
        }
        this.activeColor.set(productDetails.color?.[0] ?? '');
        this.activeSize.set(productDetails.size?.[0] ?? 0);
        this.ratingService.setRating({
          reviewCount: {
            avgRating: productDetails.rating || 0,
            totalRatings: productDetails.totalRatingCount || 0,
            ratingCount: [],
          },
          productId: Number(productDetails.productId),
        });
        this.ratingService.pushObject([
          ratings.oneStarRating || 0,
          ratings.twoStarRating || 0,
          ratings.threeStarRating || 0,
          ratings.fourStarRating || 0,
          ratings.fiveStarRating || 0,
        ]);
      });
    this.userId$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((userId) => (this.userId = userId));
  }
}
