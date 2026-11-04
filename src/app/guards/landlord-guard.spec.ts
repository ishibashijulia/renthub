import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { landlordGuard } from './landlord-guard';

describe('landlordGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => landlordGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
