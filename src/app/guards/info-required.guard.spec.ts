import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { infoRequiredGuard } from './info-required.guard';

describe('infoRequiredGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => infoRequiredGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
