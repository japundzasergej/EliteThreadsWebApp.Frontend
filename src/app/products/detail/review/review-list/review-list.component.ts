import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ReviewsDTO } from '../../../../types/social.types';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [DatePipe, RouterLink, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
})
export class ReviewListComponent {
  idTokenClaims$ = inject(AuthService).idTokenClaims$
  @Input() reviews: ReviewsDTO[] = [];
  @Output() removeEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
 

  deleteReview(reviewId: number) {
    this.removeEvent.emit(reviewId);
  }
  editReview(reviewId: number) {
    this.editEvent.emit(reviewId);
  }
}
