import { TestBed } from '@angular/core/testing';

import { UserIdResolveService } from './user-id-resolve.service';

describe('UserIdResolveService', () => {
  let service: UserIdResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIdResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
