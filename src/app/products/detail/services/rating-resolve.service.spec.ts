import { TestBed } from '@angular/core/testing';

import { RatingResolveService } from './rating-resolve.service';

describe('RatingResolveService', () => {
  let service: RatingResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatingResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
