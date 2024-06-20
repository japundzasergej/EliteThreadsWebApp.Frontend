import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CreateReviewComponent } from './create-review/create-review.component';
import { EditReviewComponent } from './edit-review/edit-review.component';
import { CreateReviewResolveService } from './services/create-review-resolve.service';
import { EditReviewResolveService } from './services/edit-review-resolve.service';
import { UserIdResolveService } from './services/user-id-resolve.service';

export const routes: Routes = [
  {
    path: 'create',
    component: CreateReviewComponent,
    resolve: {
      productId: () => inject(CreateReviewResolveService).getProductId(),
      userId: () => inject(UserIdResolveService).getUserId(),
    },
  },
  {
    path: 'edit',
    component: EditReviewComponent,
    resolve: {
      review: () => inject(EditReviewResolveService).getReview(),
      userId: () => inject(UserIdResolveService).getUserId(),
      productId: () => inject(EditReviewResolveService).getProductId(),
    },
  },
];
