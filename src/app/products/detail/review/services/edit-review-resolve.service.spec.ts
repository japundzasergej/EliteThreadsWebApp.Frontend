import { TestBed } from '@angular/core/testing';

import { EditReviewResolveService } from './edit-review-resolve.service';

describe('EditReviewResolveService', () => {
  let service: EditReviewResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditReviewResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
