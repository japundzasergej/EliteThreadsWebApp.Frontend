import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateReviewResolveService {
  private readonly productId: WritableSignal<number> = signal(0);
  setProductId(productId: number) {
    this.productId.set(productId);
  }
  getProductId() {
    return this.productId();
  }
}
