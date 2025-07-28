import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.checkAuth();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkAuth();
  }

  private checkAuth(): Observable<boolean> {
    // First check if already authenticated synchronously
    if (this.authService.isAuthenticated()) {
      return of(true);
    }

    // Check if there are stored tokens that might be valid
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      // Try to validate the current session
      return this.authService.checkAuthStatus().pipe(
        map(() => true),
        catchError(() => {
          // Auth check failed, redirect to login
          this.router.navigate(['/signin']);
          return of(false);
        }),
        take(1)
      );
    }

    // Wait briefly for any ongoing authentication process
    return this.authService.waitForAuthCheck().pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true);
        } else {
          this.router.navigate(['/signin']);
          return of(false);
        }
      }),
      take(1)
    );
  }
}
