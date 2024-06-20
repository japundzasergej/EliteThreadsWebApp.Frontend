import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { breakpoints } from '../types/breakpoints.types';
import { CardType } from './types/card.type';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Slide } from './types/slide.type';
import { CarouselComponent } from '../carousel/carousel.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ModalService } from '../services/modal-service.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    CarouselComponent,
    SlickCarouselModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly productService = inject(ProductService);
  private readonly unsubscribe = new Subject<void>();
  private readonly modalService = inject(ModalService);
  isDesktop!: boolean;
  isMobile!: boolean;

  slides: WritableSignal<Slide[]> = signal([]);

  images = [
    { url: '../../assets/linen-breeze.png', href: 'Linen Breeze' },
    { url: '../../assets/spring-trousers.png', href: 'Spring Trousers' },
    { url: '../../assets/accessories.png', href: 'Accessories' },
  ];

  mobileImages = [
    { url: '../../assets/mobile-linen-breeze.png', href: 'Linen Breeze' },
    { url: '../../assets/mobile-spring-trousers.png', href: 'Spring Trousers' },
    { url: '../../assets/mobile-accessories.png', href: 'Accessories' },
  ];
  cards: Array<CardType> = [
    { url: '../../assets/active-wear.png', collection: 'Active Wear' },
    { url: '../../assets/casual-wear.png', collection: 'Casual Wear' },
    {
      url: '../../assets/easy-formal-wear.png',
      collection: 'Easy Formal Wear',
    },
    { url: '../../assets/formal-wear.png', collection: 'Formal Wear' },
  ];

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 2,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  openModal() {
    this.modalService.open();
  }

  ngOnInit(): void {
    this.productService
      .getProducts({
        collection: 'Mid Season Sale',
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        const midSeason = response.items?.splice(0, 5);
        for (let item of midSeason!) {
          this.slides().push({
            image: item.imageList![0],
            productId: item.productId,
          });
        }
      });
    const xLarge = this.breakpointObserver.observe([breakpoints.desktop]);
    const xSmall = this.breakpointObserver.observe(['(max-width: 800px)']);

    combineLatest([xLarge, xSmall])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([xLargeResult, xSmallResult]) => {
        this.isDesktop = xLargeResult.matches;
        this.isMobile = xSmallResult.matches;
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
