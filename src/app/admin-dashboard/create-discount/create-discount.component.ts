import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { PromotionsService } from '../../services/promotions.service';
import { Subject, takeUntil } from 'rxjs';
import { CreateDiscountDTO, DiscountDTO } from '../../types/promotions.types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../toaster/services/toaster.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal-service.service';

@Component({
  selector: 'app-create-discount',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-discount.component.html',
  styleUrl: './create-discount.component.css',
})
export class CreateDiscountComponent implements OnDestroy {
  private readonly promotionsService = inject(PromotionsService);
  private readonly toastService = inject(ToasterService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly unsubscribe = new Subject<void>();
  private readonly fb = inject(FormBuilder);

  formGroup = this.fb.group({
    discountName: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(15)],
    ],
    discountAmount: [
      1,
      [Validators.required, Validators.min(1), Validators.max(100)],
    ],
  });

  handleSubmit() {
    if (this.formGroup.valid) {
      const dto = new CreateDiscountDTO();
      dto.init(this.formGroup.value);
      this.promotionsService
        .createDiscount(dto.toJSON())
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.toastService.showToastSuccess(
              `${dto.discountName} discount successfully created!`
            );
            this.router.navigate(['']);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modalService.close();
  }
}
