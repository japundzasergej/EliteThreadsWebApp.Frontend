import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AuthService, IdToken } from '@auth0/auth0-angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SocialService } from '../../../services/social.service';
import { ReviewsDTO } from '../../../types/social.types';
import { ReviewResolve } from '../services/types/review-resolve.types';
import { CreateReviewComponent } from './create-review/create-review.component';
import { EditReviewComponent } from './edit-review/edit-review.component';
import { RatingComponent } from './rating/rating.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { CreateReviewResolveService } from './services/create-review-resolve.service';
import { EditReviewResolveService } from './services/edit-review-resolve.service';
import { UserIdResolveService } from './services/user-id-resolve.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    ReviewListComponent,
    CreateReviewComponent,
    EditReviewComponent,
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    RatingComponent,
  ],
  providers: [SocialService],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit, OnDestroy {
  private readonly socialService = inject(SocialService);
  private readonly createReviewService = inject(CreateReviewResolveService);
  private readonly editReviewService = inject(EditReviewResolveService);
  private readonly userIdResolveService = inject(UserIdResolveService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly unsubscribe = new Subject<void>();
  private readonly token$: Observable<IdToken | null | undefined> =
    inject(AuthService).idTokenClaims$;
  userId: WritableSignal<string | undefined> = signal(undefined);
  userInput: WritableSignal<number> = signal(0);
  rating: ReviewResolve = {
    reviewCount: {
      avgRating: 0,
      totalRatings: 0,
      ratingCount: [],
    },
    productId: 0,
  };
  reviews: WritableSignal<ReviewsDTO[]> = signal([]);

  ratingChanged(value: number) {
    this.userInput.set(value);
    this.cdr.detectChanges();
  }

  deleteReview(reviewId: number) {
    this.socialService
      .deleteReview(reviewId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          const newList = this.reviews().filter(
            (review) => review.reviewId !== reviewId
          );
          this.reviews.set(newList);
        } else {
          throw new Error();
        }
      });
  }
  editReview(reviewId: number) {
    this.socialService
      .getReviewByReviewId(reviewId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.editReviewService.setReview(response);
        const productId = response.productId;
        this.router.navigate([
          'products',
          'detail',
          productId,
          'review',
          'edit',
        ]);
      });
  }
  oneDecimalRound(input: number) {
    return Math.round(input * 10) / 10;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngOnInit(): void {
    this.token$.pipe(takeUntil(this.unsubscribe)).subscribe((token) => {
      const userId = token?.['sub'];
      this.userId.set(userId);
      this.userIdResolveService.setUserId(userId);
      this.socialService
        .getUserRating(this.rating.productId, this.userId()!)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((userInput) => {
          this.userInput.set(userInput?.userInput || 0);
        });
    });
    this.rating = this.route.snapshot.data['rating'];
    this.createReviewService.setProductId(this.rating.productId);
    this.editReviewService.setProductId(this.rating.productId);
    this.socialService
      .getReviewsByProductId(this.rating.productId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((reviews) => {
        this.reviews.set(reviews);
      });
  }
}
