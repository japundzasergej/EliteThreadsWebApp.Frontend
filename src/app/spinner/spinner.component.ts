import { Component, inject, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [AsyncPipe, MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SpinnerComponent {
  isLoading$ = inject(LoaderService).isLoading$;
}
