import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { UserDTO } from '../../types/social.types';
import { BaseFormClass } from '../../helpers/base-form-class';
import { ImageService } from '../../services/image.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CountryCityStateService } from '../../services/country-city-state.service';
import {
  CityDTO,
  CountryDTO,
  StateDTO,
} from '../../types/city-state-country.types';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressBar, AsyncPipe, JsonPipe],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent extends BaseFormClass implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly imageService = inject(ImageService);
  private readonly countryCityStateService = inject(CountryCityStateService);
  private readonly unsubscribe = new Subject<void>();
  countries$ = new BehaviorSubject<CountryDTO[]>([]);
  states$ = new BehaviorSubject<StateDTO[]>([]);
  cities$ = new BehaviorSubject<CityDTO[]>([]);
  @Input() profile$!: Observable<UserDTO>;
  @Input() isAuth0Provider = true;
  @Output() formUploaded = new EventEmitter<UserDTO>();
  override formGroup = this.fb.group(
    {
      userName: '',
      picture: '',
      userMetadata: this.fb.group({
        firstName: '',
        lastName: '',
        userName: '',
        country: '',
        state: '',
        city: '',
        address: '',
      }),
    },
    {
      updateOn: 'change',
    }
  );
  country = this.formGroup.get('userMetadata')?.get('country');
  state = this.formGroup.get('userMetadata')?.get('state');
  city = this.formGroup.get('userMetadata')?.get('city');

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
            this.formGroup.controls.picture.setValue(imageUrl);
            this.isUploading = false;
          }
        },
        error: (error) => {
          throw new Error();
        },
      });
  }
  handleSubmit() {
    const dto = new UserDTO();
    dto.init(this.formGroup.value);
    this.formUploaded.emit(dto);
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngOnInit(): void {
    this.profile$.pipe(takeUntil(this.unsubscribe)).subscribe((response) => {
      this.formGroup.patchValue(response);
    });
    this.countryCityStateService.getCountries().subscribe((countries) => {
      this.countries$.next(countries);
    });
    this.country?.valueChanges
      .pipe(
        switchMap((country) => {
          if (country) {
            return this.countryCityStateService.getStates(country);
          } else {
            return of([]);
          }
        })
      )
      .subscribe((states) => {
        this.states$.next(states);
        this.cities$.next([]);
      });
    this.state?.valueChanges
      .pipe(
        switchMap((state) => {
          if (state) {
            return this.countryCityStateService.getCities(state);
          } else {
            return of([]);
          }
        })
      )
      .subscribe((cities) => {
        this.cities$.next(cities);
      });
  }
}
