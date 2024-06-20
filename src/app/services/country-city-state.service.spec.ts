import { TestBed } from '@angular/core/testing';

import { CountryCityStateService } from './country-city-state.service';

describe('CountryCityStateService', () => {
  let service: CountryCityStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryCityStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
