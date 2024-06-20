import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SocialService } from '../../../../services/social.service';
import { ToasterService } from '../../../../toaster/services/toaster.service';
import { CreateReviewsDTO } from '../../../../types/social.types';
import { ModalService } from '../../../../services/modal-service.service';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.css',
})
export class CreateReviewComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly productId =
    inject(ActivatedRoute).snapshot.data['productId'];
  private readonly userId = inject(ActivatedRoute).snapshot.data['userId'];
  private readonly unsubscribe = new Subject<void>();
  private readonly modalService = inject(ModalService);
  private readonly socialService = inject(SocialService);
  private readonly toastService = inject(ToasterService);
  private readonly router = inject(Router);

  formGroup = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(15)],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ],
    ],
  });
  handleSubmit() {
    if (this.formGroup.valid) {
      const dto = new CreateReviewsDTO();
      dto.init(this.formGroup.value);
      dto.createdDate = new Date();
      dto.userId = this.userId;
      this.socialService
        .createReview(this.productId, dto.toJSON())
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.toastService.showToastSuccess('Review posted!');
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
