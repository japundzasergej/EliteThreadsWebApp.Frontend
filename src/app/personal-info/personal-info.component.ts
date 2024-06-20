import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalInfoDTO } from '../types/order.types';
import { BaseFormClass } from '../helpers/base-form-class';
import { CountryCityStateService } from '../services/country-city-state.service';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { SocialService } from '../services/social.service';
import {
  CityDTO,
  CountryDTO,
  StateDTO,
} from '../types/city-state-country.types';
import { AsyncPipe } from '@angular/common';
import { OrderService } from '../services/order.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, SearchBarComponent],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css',
})
export class PersonalInfoComponent
  extends BaseFormClass
  implements OnInit, OnDestroy
{
  private readonly fb = inject(FormBuilder);
  private readonly unsubscribe = new Subject<void>();
  private readonly countryCityStateService = inject(CountryCityStateService);
  private readonly orderService = inject(OrderService);
  private readonly userId$ = inject(AuthService).idTokenClaims$.pipe(
    map((token) => token?.['sub'])
  );
  private readonly socialService = inject(SocialService);
  private userId!: string;
  private readonly route = inject(ActivatedRoute);
  private readonly orderId$ = this.route.paramMap.pipe(
    map((param) => param.get('orderId'))
  );
  countries$ = new BehaviorSubject<CountryDTO[]>([]);
  states$ = new BehaviorSubject<StateDTO[]>([]);
  cities$ = new BehaviorSubject<CityDTO[]>([]);
  override formGroup = this.fb.group({
    name: ['', Validators.required],
    country: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    address: ['', Validators.required],
  });
  isEditable: boolean = this.route.snapshot.data['isEditable'];

  country = this.formGroup.get('country');
  state = this.formGroup.get('state');
  city = this.formGroup.get('city');

  handleSubmit() {
    if (this.formGroup.valid) {
      const dto = new PersonalInfoDTO();
      dto.init(this.formGroup.value);
      dto.userId = this.userId;
      this.orderService
        .updatePersonalInfo(dto)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          if (response) {
            window.location.reload();
          } else throw new Error();
        });
    }
  }
  ngOnInit(): void {
    if (this.isEditable) {
      this.orderId$
        .pipe(switchMap((orderId) => this.orderService.getOrder(orderId!)))
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) =>
          this.formGroup.patchValue({
            name: response.orderHeader?.personalInfo?.name,
            country: response.orderHeader?.personalInfo?.country,
            state: response.orderHeader?.personalInfo?.state,
            city: response.orderHeader?.personalInfo?.city,
            address: response.orderHeader?.personalInfo?.address,
          })
        );
    } else {
      this.userId$
        .pipe(
          switchMap((userId) => {
            this.userId = userId;
            return this.socialService.getUser(userId);
          })
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) =>
          this.formGroup.patchValue({
            name: `${response.userMetadata?.firstName} ${response.userMetadata?.lastName}`,
            country: response.userMetadata?.country,
            state: response.userMetadata?.state,
            city: response.userMetadata?.city,
            address: response.userMetadata?.address,
          })
        );
    }
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
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
