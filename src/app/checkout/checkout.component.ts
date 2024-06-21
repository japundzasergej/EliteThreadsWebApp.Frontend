import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { OrderService } from '../services/order.service';
import { SocialService } from '../services/social.service';
import { OrderDTO } from '../types/order.types';
import { UserDTO } from '../types/social.types';
import { ToasterService } from '../toaster/services/toaster.service';
import { StripeService } from '../services/stripe.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [AsyncPipe, SearchBarComponent, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private readonly orderId$ = inject(ActivatedRoute).paramMap.pipe(
    map((param) => param.get('orderId'))
  );
  private readonly orderService = inject(OrderService);
  private readonly stripeService = inject(StripeService);
  private readonly unsubscribe = new Subject<void>();
  private readonly socialService = inject(SocialService);
  private stripePromise?: Promise<Stripe | null>;
  private readonly toast = inject(ToasterService);
  private readonly userId$ = inject(AuthService).idTokenClaims$.pipe(
    map((token) => token?.['sub'])
  );
  order$!: Observable<OrderDTO>;
  user$!: Observable<UserDTO>;
  orderId!: string;
  calculateDeliveryDate(dateString: string | undefined): Date | undefined {
    if (typeof dateString === 'string') {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000);
      }
    }
    return undefined;
  }
  cancelOrder(orderId: string) {
    this.orderService
      .cancelOrder(orderId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess(`Order with id ${orderId} cancelled.`);
          window.location.reload();
        } else throw new Error();
      });
  }
  proceedToPayment() {
    this.order$
      .pipe(switchMap((order) => this.stripeService.getSessionId(order)))
      .subscribe((response) => {
        this.redirectToCheckout(response.sessionId!, response.pubKey!);
      });
  }

  private async redirectToCheckout(
    sessionId: string,
    stripePublicKey: string
  ): Promise<void> {
    this.stripePromise = loadStripe(stripePublicKey);
    const stripe: Stripe | null = await this.stripePromise;

    stripe?.redirectToCheckout({ sessionId: sessionId }).then((error) => {
      console.log(error.error.message);
    });
  }
  ngOnInit(): void {
    this.order$ = this.orderId$.pipe(
      switchMap((orderId) => {
        this.orderId = orderId!;
        return this.orderService.getOrder(orderId!);
      })
    );
    this.user$ = this.userId$.pipe(
      switchMap((userId) => this.socialService.getUser(userId))
    );
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
