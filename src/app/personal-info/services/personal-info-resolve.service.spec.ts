import { TestBed } from '@angular/core/testing';

import { PersonalInfoResolveService } from './personal-info-resolve.service';

describe('PersonalInfoResolveService', () => {
  let service: PersonalInfoResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalInfoResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
