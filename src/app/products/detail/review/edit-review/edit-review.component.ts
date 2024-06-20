import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SocialService } from '../../../../services/social.service';
import { ToasterService } from '../../../../toaster/services/toaster.service';
import { EditReviewDTO, ReviewsDTO } from '../../../../types/social.types';
import { ModalService } from '../../../../services/modal-service.service';

@Component({
  selector: 'app-edit-review',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.css',
})
export class EditReviewComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly unsubscribe = new Subject<void>();
  private readonly socialService = inject(SocialService);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToasterService);
  private readonly review: ReviewsDTO =
    inject(ActivatedRoute).snapshot.data['review'];
  private readonly productId =
    inject(ActivatedRoute).snapshot.data['productId'];
  private readonly router = inject(Router);
  formGroup = this.fb.group({
    title: [
      this.review.title,
      [Validators.required, Validators.minLength(5), Validators.maxLength(15)],
    ],
    description: [
      this.review.description,
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ],
    ],
  });
  handleSubmit() {
    if (this.formGroup.valid) {
      const dto = new EditReviewDTO();
      dto.init(this.formGroup.value);
      this.socialService
        .editReview(this.review.reviewId || 0, dto.toJSON())
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.toastService.showToastSuccess('Review edited successfully!');
            this.modalService.closeReview();
            this.router.navigate(['/products/detail', this.productId]);
          } else {
            throw new Error();
          }
        });
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
