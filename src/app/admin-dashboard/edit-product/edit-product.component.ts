import { KeyValuePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { CarouselComponent } from '../../carousel/carousel.component';
import { EnumPipe } from '../../pipes/enum.pipe';
import {
  Colors,
  EditProductDTO,
  Size,
} from '../../products/types/product.types';
import { ImageService } from '../../services/image.service';
import { ModalService } from '../../services/modal-service.service';
import { ProductService } from '../../services/product.service';
import { ToasterService } from '../../toaster/services/toaster.service';
import { AdminForm } from '../helpers/admin-form-class';
import { mapValuesToFormGroup } from './helpers/mapValuesToFormGroup';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    EnumPipe,
    SlickCarouselModule,
    MatProgressBar,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent
  extends AdminForm
  implements OnInit, OnDestroy
{
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToasterService);
  private readonly imageService = inject(ImageService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly unsubscribe = new Subject<void>();
  private productId!: number;
  size = Size;
  colors = Colors;
  formSubmitted = false;

  override formGroup = this.fb.group(
    {
      string: this.fb.group({
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
        model: ['', Validators.required],
        compositions: ['', Validators.required],
        fabric: ['', Validators.required],
        pattern: ['', Validators.required],
        length: ['', Validators.required],
      }),
      number: this.fb.group({
        price: [0, [Validators.required, Validators.min(1)]],
        productsLeft: [0, [Validators.required, Validators.min(1)]],
      }),
      select: this.fb.group({
        new: [false, Validators.required],
        mustHave: [false, Validators.required],
      }),
      checkbox: this.fb.group({
        size: this.fb.array([], Validators.required),
        color: this.fb.array([], Validators.required),
      }),
      imageList: this.fb.array([], Validators.required),
    },
    {
      updateOn: 'blur',
    }
  );

  imagesArray = this.formGroup.get('imageList') as FormArray;
  colorsArray = this.formGroup.get('checkbox')?.get('color') as FormArray;
  sizesArray = this.formGroup.get('checkbox')?.get('size') as FormArray;

  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  checkedSizes(item: number) {
    return super.checkedItems(item, this.sizesArray);
  }
  checkedColors(item: string) {
    return super.checkedItems(item, this.colorsArray);
  }
  updateSizes(item: number, event: Event) {
    super.updateItem(item, event, this.sizesArray);
  }
  updateColors(item: string, event: Event) {
    return super.updateItem(item, event, this.colorsArray);
  }

  splitAndCapitalize(input: string): string {
    const match = input.split(/(?=[A-Z])/);
    const capitalizeEachWord = (input: string): string => {
      return input.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    };
    return match.map((w) => capitalizeEachWord(w)).join(' ');
  }

  async upload(event: Event, index: number, imageUrl: string) {
    const dto = await super.returnImage(event);
    dto.imageUrl = imageUrl;
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
            const newControl = this.fb.control(imageUrl);
            this.imagesArray.setControl(index, newControl);
            this.isUploading = false;
          }
        },
        error: (error) => {
          throw new Error();
        },
      });
  }

  handleSubmit() {
    const dto = new EditProductDTO();
    dto.init(this.formGroup.value);

    this.productService
      .editProduct(this.productId, dto.toJSON())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result) => {
        if (result) {
          this.toastService.showToastSuccess('Product edited successfully!');
          this.formSubmitted = true;
          this.router.navigate(['']);
        } else {
          throw new Error();
        }
      });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((param) =>
          this.productService.getProductDetail(Number(param.get('productId')))
        )
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((product) => {
        this.productId = Number(product.productId) ?? 0;

        for (let item of product.imageList!) {
          const newControl = new FormControl<string>(item);
          this.imagesArray.push(newControl);
        }
        for (let item of product.size!) {
          const newControl = new FormControl<number>(item);
          this.sizesArray.push(newControl);
        }
        for (let item of product.color!) {
          const newControl = new FormControl<string>(item);
          this.colorsArray.push(newControl);
        }
        mapValuesToFormGroup(this.formGroup, product);
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modalService.close();
  }
}
