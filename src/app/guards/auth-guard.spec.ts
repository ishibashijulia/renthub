import { TestBed } from '@angular/core/testing';
import { UrlTree, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth';

describe('authGuard', () => {
  const run = (loggedIn: boolean) => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isLoggedIn: signal(loggedIn) } },
      ],
    });
    return TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/profile' } as any));
  };

  it('allows access when logged in', () => {
    expect(run(true)).toBe(true);
  });

  it('redirects to /login when logged out', () => {
    const result = run(false);
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toContain('/login');
  });
});
