import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NgClass } from '@angular/common';
import { SocialService } from '../../../../services/social.service';
import { UserRatingDTO } from '../../../../types/social.types';
import { ModalService } from '../../../../services/modal-service.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../toaster/services/toaster.service';
@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent implements OnInit, OnDestroy {
  @Input() productId: number = 0 || 0;
  @Input() userId: string | undefined;
  @Input() userInput: number = 0;
  @Output() productRated = new EventEmitter<number>();
  private readonly unsubscribe = new Subject<void>();
  private readonly socialService = inject(SocialService);
  private readonly modalService = inject(ModalService);
  private readonly toast = inject(ToasterService);
  private readonly router = inject(Router);
  rating = new FormControl();
  hoveredRating: number = 0;

  get stars(): number[] {
    return Array.from({ length: 10 }, (_, i) => i * 0.5 + 0.5);
  }

  ratingChanged(value: number) {
    this.productRated.emit(value);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.rating.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        const dto = new UserRatingDTO();
        (dto.productId = this.productId),
          (dto.userId = this.userId),
          (dto.userInput = value);
        this.socialService
          .updateProductRating(dto)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((response) => {
            if (response) {
              this.ratingChanged(value);
              this.toast.showToastSuccess('Rating updated!');
              this.modalService.closeReview();
              this.router.navigate(['/products/detail', this.productId]);
            } else {
              throw new Error();
            }
          });
      });
  }
}
