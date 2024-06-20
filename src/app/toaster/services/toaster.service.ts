import { inject, Injectable } from '@angular/core';
import { LocalService } from '../../services/local.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly localStorage: LocalService;
  private readonly toastSuccessSubject: BehaviorSubject<string | null>;
  private readonly toastErrorSubject: BehaviorSubject<string | null>;
  toastSuccess$: Observable<string | null>;
  toastError$: Observable<string | null>;

  constructor(localStorage: LocalService) {
    this.localStorage = localStorage;
    const initialToastSuccessMessage =
      this.localStorage.getData('toastSuccess');
    const initialToastErrorMessage = this.localStorage.getData('toastError');
    this.toastSuccessSubject = new BehaviorSubject<string | null>(
      initialToastSuccessMessage
    );
    this.toastErrorSubject = new BehaviorSubject<string | null>(
      initialToastErrorMessage
    );
    this.toastSuccess$ = this.toastSuccessSubject.asObservable();
    this.toastError$ = this.toastErrorSubject.asObservable();
  }

  showToastSuccess(message: string) {
    this.localStorage.setData('toastSuccess', message);
    this.toastSuccessSubject.next(message);
  }

  dismissToastSuccess() {
    this.localStorage.removeData('toastSuccess');
    this.toastSuccessSubject.next(null);
  }
  showToastError(message: string) {
    this.localStorage.setData('toastError', message);
    this.toastErrorSubject.next(message);
  }

  dismissToastError() {
    this.localStorage.removeData('toastError');
    this.toastErrorSubject.next(null);
  }
}
