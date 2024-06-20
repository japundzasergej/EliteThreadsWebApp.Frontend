import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'any',
})
export class ModalService {
  private readonly isModalOpen = new BehaviorSubject<boolean>(
    localStorage.getItem('modalOpen') === 'true'
  );
  private readonly isReviewOpen = new BehaviorSubject<boolean>(
    localStorage.getItem('reviewOpen') === 'true'
  );
  private readonly localService = inject(LocalService);
  modal$ = this.isModalOpen.asObservable();
  review$ = this.isReviewOpen.asObservable();

  close() {
    this.localService.removeData('modalOpen');
    this.isModalOpen.next(false);
  }
  open() {
    this.localService.setData('modalOpen', 'true');
    this.isModalOpen.next(true);
  }

  closeReview() {
    this.localService.removeData('reviewOpen');
    this.isReviewOpen.next(false);
  }
  openReview() {
    this.localService.setData('reviewOpen', 'true');
    this.isReviewOpen.next(true);
  }
}
