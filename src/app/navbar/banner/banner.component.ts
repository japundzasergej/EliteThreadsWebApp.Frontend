import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { PromotionsService } from '../../services/promotions.service';
import { GeoLocation } from './types/geolocation.types';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  imports: [AsyncPipe],
  providers: [GeolocationService],
})
export class BannerComponent implements OnInit, OnDestroy {
  private readonly unsubscribe = new Subject<void>();
  countryInfo$: Observable<GeoLocation> =
    inject(GeolocationService).getUserCountryInfo();
  messages$ = inject(PromotionsService).getActivePromotions();
  currentIndex = 0;
  indexInterval: any;
  messagesLength = 0;

  incrementIndex() {
    this.currentIndex = (this.currentIndex + 1) % this.messagesLength;
  }

  ngOnInit(): void {
    this.messages$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((messages) => (this.messagesLength = messages.length));
    this.indexInterval = setInterval(() => {
      this.incrementIndex();
    }, 4000);
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    clearInterval(this.indexInterval);
  }
}
