// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, tap, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    full_name: string;
    phone_verified: boolean;
    sub: string;
  };
  aud: string;
  email: string;
  phone: string;
  created_at: string;
  confirmed_at: string;
  email_confirmed_at: string;
  phone_confirmed_at: string | null;
  last_sign_in_at: string;
  role: string;
  updated_at: string;
  identities: any[];
  is_anonymous: boolean;
  factors: any;
}

export interface Session {
  provider_token: string | null;
  provider_refresh_token: string | null;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: User;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

// New interface for password reset auto-login
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected http = inject(HttpClient);
  private router = inject(Router);

  protected readonly API_URL = environment.apiUrl;

  // Session storage keys
  private readonly USER_KEY = 'auth_user';
  private readonly SESSION_KEY = 'auth_session';
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_AT_KEY = 'expires_at';

  // Auth state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private authError = new Subject<string | null>();
  private tokenRefreshTimer: any;

  // Public observables
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  authError$ = this.authError.asObservable();

  constructor() {
    // Check authentication status on service initialization
    this.initializeFromStorage();
  }

  resetPassword(arg0: { email: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/user/forgot-password`, arg0);
  }

  updatePassword(arg0: {
    accessToken: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/user/update-password`, arg0);
  }

  /**
   * Set authentication tokens after password reset
   * This allows auto-login after successful password update
   */
  setAuthTokens(tokens: AuthTokens): Observable<User> {
    // Store tokens in session storage
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    sessionStorage.setItem(this.EXPIRES_AT_KEY, tokens.expiresAt.toString());

    // Update auth state
    this.isAuthenticatedSubject.next(true);

    // Fetch user data with the new token to complete the auth state
    return this.http
      .get<{ user: User }>(`${this.API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .pipe(
        tap((response) => {
          // Store user data
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

          // Create a mock session object for consistency
          const session: Session = {
            provider_token: null,
            provider_refresh_token: null,
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            expires_in: Math.floor(
              (tokens.expiresAt * 1000 - Date.now()) / 1000
            ),
            expires_at: tokens.expiresAt,
            token_type: 'bearer',
            user: response.user,
          };
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

          // Update reactive state
          this.currentUserSubject.next(response.user);
          this.scheduleTokenRefresh();
        }),
        switchMap((response) => [response.user]),
        catchError((error) => {
          // If fetching user fails, clear the tokens and throw error
          this.clearStorage();
          this.isAuthenticatedSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/users/login`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Sign up new user
   */
  signup(credentials: SignupCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/users/signup`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http
      .post(`${this.API_URL}/users/logout`, {}, this.getAuthHeaders())
      .pipe(
        tap(() => {
          this.handleLogout();
        }),
        catchError((error) => {
          // Even if logout fails on backend, clear local state
          this.handleLogout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.handleLogout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<AuthResponse>(`${this.API_URL}/users/refresh`, {
        refreshToken: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError((error) => {
          // If refresh fails, logout user
          this.handleLogout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Check current authentication status
   */
  checkAuthStatus(): Observable<User> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      this.handleLogout();
      return throwError(() => new Error('No access token'));
    }

    return this.http
      .get<{ user: User }>(`${this.API_URL}/users/me`, this.getAuthHeaders())
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
          this.scheduleTokenRefresh();
        }),
        switchMap((response) => [response.user]),
        catchError(() => {
          this.handleLogout();
          return throwError(() => new Error('Not authenticated'));
        })
      );
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated synchronously
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value && this.hasValidToken();
  }

  /**
   * Wait for authentication check to complete
   */
  waitForAuthCheck(): Observable<boolean> {
    return this.isAuthenticated$.pipe(
      filter((isAuth) => isAuth !== null),
      take(1)
    );
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearAuthError() {
    this.authError.next(null);
  }

  /**
   * Initialize authentication state from session storage
   */
  private initializeFromStorage(): void {
    try {
      const storedUser = sessionStorage.getItem(this.USER_KEY);
      const accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);

      if (storedUser && accessToken && this.hasValidToken()) {
        const user = JSON.parse(storedUser) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.scheduleTokenRefresh();
      } else {
        this.clearStorage();
        this.isAuthenticatedSubject.next(false);
      }
    } catch (error) {
      console.error('Error initializing from storage:', error);
      this.clearStorage();
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Check if current token is valid (not expired)
   */
  private hasValidToken(): boolean {
    const expiresAt = sessionStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expiresAt) return false;

    const expirationTime = parseInt(expiresAt, 10) * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    // Store user data
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(response.session));

    // Store tokens and expiration
    sessionStorage.setItem(
      this.ACCESS_TOKEN_KEY,
      response.session.access_token
    );
    sessionStorage.setItem(
      this.REFRESH_TOKEN_KEY,
      response.session.refresh_token
    );
    sessionStorage.setItem(
      this.EXPIRES_AT_KEY,
      response.session.expires_at.toString()
    );

    // Update reactive state
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);

    // Schedule token refresh
    this.scheduleTokenRefresh(response.session.expires_in);
  }

  /**
   * Handle logout
   */
  protected handleLogout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearTokenRefreshTimer();
    this.router.navigate(['/login']);
  }

  /**
   * Clear all auth data from session storage
   */
  private clearStorage(): void {
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  /**
   * Get authorization headers for HTTP requests
   */
  protected getAuthHeaders(): { headers: { Authorization: string } } {
    const token = this.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(expiresIn?: number): void {
    this.clearTokenRefreshTimer();

    let refreshTime: number;

    if (expiresIn) {
      // Refresh 5 minutes before expiration
      refreshTime = (expiresIn - 300) * 1000;
    } else {
      // Calculate from stored expiration time
      const expiresAt = sessionStorage.getItem(this.EXPIRES_AT_KEY);
      if (expiresAt) {
        const expirationTime = parseInt(expiresAt, 10) * 1000;
        const now = Date.now();
        refreshTime = expirationTime - now - 5 * 60 * 1000; // 5 minutes before
      } else {
        // Default to 50 minutes if no expiration data
        refreshTime = 50 * 60 * 1000;
      }
    }

    // Only schedule if refresh time is positive
    if (refreshTime > 0) {
      this.tokenRefreshTimer = timer(refreshTime).subscribe(() => {
        this.refreshToken().subscribe({
          error: (error) => {
            console.error('Token refresh failed:', error);
            this.handleLogout();
          },
        });
      });
    }
  }

  /**
   * Clear token refresh timer
   */
  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      this.tokenRefreshTimer.unsubscribe();
      this.tokenRefreshTimer = null;
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An error occurred';

    // Server-side error
    switch (error?.status) {
      case 401:
        errorMessage = 'Invalid credentials';
        // Clear stored auth data on 401
        this.handleLogout();
        break;
      case 403:
        errorMessage = 'Access forbidden';
        break;
      case 422:
        errorMessage = 'A user with this email already signed up';
        break;
      case 500:
        errorMessage = 'Server error';
        break;
      default:
        errorMessage = error.error?.message || 'Unknown error';
    }
    this.authError.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  };
}
