import { animate, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToasterService } from './services/toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [AsyncPipe],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [animate('0.1s', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
})
export class ToasterComponent {
  private readonly toastService = inject(ToasterService);
  toastSuccess$ = this.toastService.toastSuccess$;
  toastError$ = this.toastService.toastError$;

  dismissToastSuccess() {
    this.toastService.dismissToastSuccess();
  }

  dismissToastError() {
    this.toastService.dismissToastError();
  }
}
