import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './payment-failed.component.html',
  styleUrl: './payment-failed.component.css',
})
export class PaymentFailedComponent {
  orderId$ = inject(ActivatedRoute).queryParams.pipe(
    map((params) => params['orderHeaderId'])
  );
}
