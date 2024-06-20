import { ScrollingModule } from '@angular/cdk/scrolling';
import { CurrencyPipe, KeyValuePipe, NgClass } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { CarouselComponent } from '../../carousel/carousel.component';
import { EnumPipe } from '../../pipes/enum.pipe';
import { SubCategories } from '../../products/enums/product-enums';
import {
  Colors,
  CreateProductDTO,
  Size,
} from '../../products/types/product.types';
import { ImageService } from '../../services/image.service';
import { ModalService } from '../../services/modal-service.service';
import { ProductService } from '../../services/product.service';
import { ToasterService } from '../../toaster/services/toaster.service';
import { AdminForm } from '../helpers/admin-form-class';
import { imagesValidator } from './validators/images.validator';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    EnumPipe,
    KeyValuePipe,
    ScrollingModule,
    CurrencyPipe,
    MatProgressBarModule,
    CarouselComponent,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent
  extends AdminForm
  implements OnDestroy, OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly imageService = inject(ImageService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);
  private readonly unsubscribe = new Subject<void>();
  private readonly toastService = inject(ToasterService);
  steps = 1;
  subcategories = SubCategories;
  size = Size;
  colors = Colors;
  color = '#FAFAFA';
  formSubmitted = false;

  override formGroup: FormGroup = this.fb.group(
    {
      description: this.fb.group({
        productName: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15),
          ],
        ],
        productDescription: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(150),
          ],
        ],
        price: [1, [Validators.required, Validators.min(1)]],
        productsLeft: [1, [Validators.required, Validators.min(1)]],
        new: [false, Validators.required],
        mustHave: [false, Validators.required],
      }),
      info: this.fb.group({
        model: ['', Validators.required],
        compositions: ['', Validators.required],
        fabric: ['', Validators.required],
        pattern: ['', Validators.required],
        length: ['', Validators.required],
      }),
      select: this.fb.group({
        subcategoryId: [1, Validators.required],
      }),
      checkbox: this.fb.group({
        size: this.fb.array([], Validators.required),
        color: this.fb.array([], Validators.required),
      }),
      images: this.fb.array([], imagesValidator(3, 5)),
    },
    {
      updateOn: 'blur',
    }
  );
  imagesArray = this.formGroup.get('images') as FormArray;
  slides: { url: string }[] = [];
  colorsArray = this.formGroup.get('checkbox')?.get('color') as FormArray;
  sizesArray = this.formGroup.get('checkbox')?.get('size') as FormArray;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    autoplay: false,
  };
  incrementSteps() {
    this.steps++;
  }
  decrementSteps() {
    this.steps--;
  }
  capitalizeFirstLetter(input: string) {
    const firstChar = input.substring(0, 1);
    return firstChar.toUpperCase() + input.substring(1);
  }
  updateColors(item: string, event: Event) {
    super.updateItem(item, event, this.colorsArray);
  }
  updateSizes(item: number, event: any) {
    super.updateItem(item, event, this.sizesArray);
  }

  async upload(event: Event) {
    const dto = await super.returnImage(event);
    this.imageService
      .uploadImage(dto.toJSON(), {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total!);
            this.progress = progress;
          } else if (event instanceof HttpResponse) {
            const imageUrl = event.body as string;
            if (this.imagesArray.length < 5) {
              const newControl = this.fb.control(imageUrl, Validators.required);
              this.imagesArray.push(newControl);
              this.updateSlides();
            }
            this.isUploading = false;
          }
        },
        error: (error) => {
          throw new Error();
        },
      });
  }

  handleSubmit() {
    if (this.formGroup.valid) {
      const dto = new CreateProductDTO();
      dto.init(this.formGroup.value);

      const json = dto.toJSON();

      this.productService
        .createProduct(json)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((result) => {
          if (result) {
            this.toastService.showToastSuccess('Product added successfully!');
            this.formSubmitted = true;
            this.router.navigate(['']);
          } else {
            this.router.navigate(['']);
            throw new Error();
          }
        });
    }
  }
  @Memoize()
  returnEnum(input: string) {
    if (input === 'size') {
      return this.size;
    } else {
      return this.subcategories;
    }
  }
  updateSlides() {
    this.slides = this.imagesArray.controls.map((control) => ({
      url: control.value,
    }));
  }

  ngOnInit(): void {
    this.updateSlides();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modalService.close();
  }
}
