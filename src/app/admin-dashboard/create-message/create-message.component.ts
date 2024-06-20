import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../services/modal-service.service';
import { PromotionsService } from '../../services/promotions.service';
import { ToasterService } from '../../toaster/services/toaster.service';
import { CreatePromotionDTO } from '../../types/promotions.types';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-create-message',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.css',
})
export class CreateMessageComponent {
  private readonly promotionsService = inject(PromotionsService);
  private readonly unsubscribe = new Subject<void>();
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToasterService);
  private readonly router = inject(Router);
  message = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(15),
  ]);

  handleSubmit() {
    const dto = new CreatePromotionDTO();
    dto.message = this.message.value!;

    if (this.message.valid) {
      this.promotionsService
        .createPromotion(dto.toJSON())
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.toastService.showToastSuccess(
              `Promotion message successfully created!`
            );
            this.router.navigate(['']);
          } else throw new Error();
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modalService.close();
  }
}
