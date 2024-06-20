import { CurrencyPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EnumPipe } from '../../pipes/enum.pipe';
import { Size } from '../types/product.types';
import { MatButtonModule } from '@angular/material/button';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MinMax } from './types/min-max.types';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CurrencyPipe,
    EnumPipe,
    MatButtonModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [animate('0.1s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class FilterComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minMax']) {
      const newMinMax = changes['minMax'].currentValue;
      if (newMinMax) {
        this.formGroup.get('price')?.setValue(newMinMax.minPrice);
      }
    }
  }
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  @Output() close = new EventEmitter<void>();
  @Output() clearEvent = new EventEmitter<void>();
  @Input() minMax!: MinMax;
  size = Size;
  formGroup = this.fb.group({
    size: new FormControl<number | null>(null),
    color: new FormControl<string | null>(null),
    composition: new FormControl<string | null>(null),
    price: new FormControl<number>(0),
  });
  colors = [
    'Orange',
    'Yellow',
    'Red',
    'Pink',
    'Cream',
    'Grey',
    'Green',
    'Black',
    'Brown',
    'Beige',
    'White',
    'Blue',
  ];

  handleSubmit() {
    let params = new HttpParams();
    let queryParams: { [key: string]: string } = {};
    if (this.formGroup.get('size')?.value !== null) {
      params = params.append('size', this.formGroup.get('size')?.value ?? '');
    }
    if (this.formGroup.get('color')?.value !== null) {
      params = params.append('color', this.formGroup.get('color')?.value ?? '');
    }
    if (this.formGroup.get('composition')?.value !== null) {
      params = params.append(
        'composition',
        this.formGroup.get('composition')?.value ?? ''
      );
    }
    if (this.formGroup.get('price')?.touched) {
      params = params.append('priceMin', this.minMax.minPrice.toString());
      params = params.append(
        'priceMax',
        this.formGroup.get('price')?.value?.toString() ?? ''
      );
    }
    params.keys().forEach((key) => {
      queryParams[key] = params.get(key) ?? '';
    });
    this.router.navigate(['products'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  closeFilters() {
    this.close.emit();
  }
  clearFilters() {
    this.clearEvent.emit();
  }
}
