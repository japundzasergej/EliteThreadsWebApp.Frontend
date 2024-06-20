import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CarouselConfig } from './types/carousel-config.types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: { url: string; href? : string }[] = [];
  @Input() config: CarouselConfig = {
    autoplay: true,
  };

  currentIndex: number = 0;
  timeoutId?: number;

  ngOnInit(): void {
    if (this.config.autoplay) {
      this.resetTimer();
    }
  }
  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
  }
  resetTimer() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.goToNext(), 3000);
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.slides.length - 1
      : this.currentIndex - 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  getCurrentSlideSrc() {
    return this.slides[this.currentIndex].url;
  }
  getCurrentSlideHref() {
    return this.slides[this.currentIndex].href;
  }

  getQueryParameters(): { [key: string]: string } | undefined {
    const href = this.slides[this.currentIndex].href;
    if(href) {
      switch (href) {
        case 'Accessories':
          return { category: href };
        default:
          return {
            collection: href,
          };
      }
    }
    return undefined;
  }
}
