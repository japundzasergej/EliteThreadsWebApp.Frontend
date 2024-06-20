import { Component, inject, OnDestroy } from '@angular/core';
import { PromotionsService } from '../../services/promotions.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../services/modal-service.service';
import { ToasterService } from '../../toaster/services/toaster.service';
import { CreateCollectionDTO } from '../../types/promotions.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-collection.component.html',
  styleUrl: './create-collection.component.css',
})
export class CreateCollectionComponent implements OnDestroy {
  private readonly promotionsService = inject(PromotionsService);
  private readonly unsubscribe = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToasterService);
  private readonly router = inject(Router);

  formGroup = this.fb.group(
    {
      collectionName: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
        ],
      ],
    },
    {
      updateOn: 'blur',
    }
  );

  handleSubmit() {
    if (this.formGroup.valid) {
      const dto = new CreateCollectionDTO();
      dto.init(this.formGroup.value);

      this.promotionsService
        .createCollection(dto.toJSON())
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.toastService.showToastSuccess(
              `${dto.collectionName} collection successfully created!`
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
