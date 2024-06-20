import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Pagination } from '../../types/pagination.types';
import { ProductDTO } from '../types/product.types';
import { ProductsRatingComponent } from './products-rating/products-rating.component';
import { ColorMap } from './types/colorMap.types';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    ProductsRatingComponent,
    RouterLink,
    CurrencyPipe,
    MatButtonModule,
    NgClass,
    NgStyle,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);
  @Output() modalOpened = new EventEmitter<void>();
  @ViewChildren('image') images!: QueryList<ElementRef<HTMLImageElement>>;
  imageFilters: { [key: number]: string } = {};
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
  @Input() products!: ProductDTO[];
  @Input() pagination!: Pagination;
  @Input() wishlistProductIds!: number[];
  @Output() clearEvent = new EventEmitter<void>();
  totalPages: Array<number> = [];
  @Output() addedToWishlist = new EventEmitter<number>();
  @Output() removedFromWishlist = new EventEmitter<number>();

  openModal() {
    this.modalOpened.emit();
  }
  clearFilters() {
    this.clearEvent.emit();
  }

  addToWishlist(productId: number) {
    this.addedToWishlist.emit(productId);
    this.cdr.detectChanges();
  }
  removeFromWishlist(productId: number) {
    this.removedFromWishlist.emit(productId);
    this.cdr.detectChanges();
  }

  isCurrentPage(pageNumber: number): boolean {
    const { pageIndex } = this.pagination;
    return pageNumber === pageIndex;
  }

  isOnWishList(productId: number) {
    return this.wishlistProductIds.includes(productId) ? true : false;
  }

  async hoverImage(imageList: string[], product: ProductDTO) {
    const imageElement = this.images.find(
      (img) => img.nativeElement.alt === product.productId?.toString()
    );
    if (imageElement) {
      imageElement.nativeElement.classList.add('image-transition');
      imageElement.nativeElement.style.opacity = '0';
      await new Promise((resolve) => setTimeout(resolve, 200));
      imageElement.nativeElement.src = imageList[1];
      imageElement.nativeElement.style.opacity = '1';
    }
  }

  async unhoverImage(imageList: string[], product: ProductDTO) {
    const imageElement = this.images.find(
      (img) => img.nativeElement.alt === product.productId?.toString()
    );
    if (imageElement) {
      imageElement.nativeElement.classList.add('image-transition');
      imageElement.nativeElement.style.opacity = '0';
      await new Promise((resolve) => setTimeout(resolve, 200));
      imageElement.nativeElement.src = imageList[0];
      imageElement.nativeElement.style.opacity = '1';
    }
  }

  applyFilter(color: string, productId: number) {
    this.imageFilters[
      productId
    ] = `sepia(0.3) brightness(0.8) hue-rotate(${this.getHueRotation(
      color
    )}deg)`;
  }

  removeFilter(productId: number) {
    delete this.imageFilters[productId];
  }

  getHueRotation(color: string): number {
    switch (color) {
      case 'Orange':
        return 30;
      case 'Yellow':
        return 60;
      case 'Red':
        return 0;
      case 'Pink':
        return 330;
      case 'Cream':
        return 50;
      case 'Grey':
        return 0;
      case 'Green':
        return 120;
      case 'Black':
        return 0;
      case 'Brown':
        return 30;
      case 'Beige':
        return 40;
      case 'White':
        return 0;
      case 'Blue':
        return 240;
      default:
        return 0;
    }
  }

  priceAfterDiscount(index: number): number {
    return this.calculateDiscount(index);
  }

  private calculateDiscount(index: number) {
    const indexedProduct = this.products[index];
    const discount =
      indexedProduct.price! * (indexedProduct.discountAmount! / 100);
    const finalPrice = indexedProduct.price! - discount;
    return finalPrice;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination']) {
      const { pageCount } = this.pagination;
      this.totalPages = Array.from({ length: pageCount! }, (_, i) => i + 1);
    }
  }
}
