import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

// PrimeNG
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { UrlTokenService } from '../../../services/urlToken.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    CardModule,
  ],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  newPasswordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  isLoading = false;
  hasValidTokens = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private urlTokenService = inject(UrlTokenService);

  ngOnInit() {
    this.initializeTokens();
  }

  private initializeTokens() {
    // First try to extract tokens from URL
    const urlTokens = this.urlTokenService.extractRecoveryTokens();

    if (urlTokens) {
      // Store tokens and clean up URL
      this.urlTokenService.storeRecoveryTokens(urlTokens);
      this.urlTokenService.cleanupUrl();
      this.hasValidTokens = true;
      return;
    }

    // If no URL tokens, check if we have valid stored tokens
    if (this.urlTokenService.areTokensValid()) {
      this.hasValidTokens = true;
      return;
    }

    // No valid tokens found
    this.hasValidTokens = false;
    this.errorMessage =
      'Invalid or expired password reset link. Please request a new password reset.';

    // Clear any invalid stored tokens
    this.urlTokenService.clearRecoveryTokens();
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.newPasswordForm.invalid || !this.hasValidTokens) return;

    const tokens = this.urlTokenService.getStoredRecoveryTokens();

    if (!tokens || !this.urlTokenService.areTokensValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Session Expired',
        detail:
          'Password reset session has expired. Please request a new reset link.',
      });
      this.hasValidTokens = false;
      this.errorMessage =
        'Session expired. Please request a new password reset.';
      return;
    }

    this.isLoading = true;

    this.authService
      .updatePassword({
        accessToken: tokens.accessToken,
        password: this.newPasswordForm.value.password ?? '',
      })
      .subscribe({
        next: () => {
          // Auto-login the user with the recovery tokens
          this.authService
            .setAuthTokens({
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              expiresAt: tokens.expiresAt,
            })
            .subscribe({
              next: () => {
                this.isLoading = false;
                // Clear the recovery tokens from session storage
                this.urlTokenService.clearRecoveryTokens();

                this.messageService.add({
                  severity: 'success',
                  summary: 'Password Updated',
                  detail:
                    'Your password has been successfully updated. You are now logged in.',
                });

                // Redirect to chat after a brief delay - auth guard will allow this now
                setTimeout(() => {
                  this.router.navigate(['/chat']);
                }, 1500);
              },
              error: (authError) => {
                this.isLoading = false;
                // Clear recovery tokens even if auth setup fails
                this.urlTokenService.clearRecoveryTokens();

                this.messageService.add({
                  severity: 'warn',
                  summary: 'Password Updated',
                  detail:
                    'Password updated successfully, but automatic login failed. Please sign in manually.',
                });

                // Redirect to login page
                setTimeout(() => {
                  this.router.navigate(['/signin']);
                }, 2000);
              },
            });
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail:
              err.message || 'Failed to update password. Please try again.',
          });

          // If token is invalid, show error state
          if (
            err.status === 401 ||
            err.message?.includes('token') ||
            err.message?.includes('expired')
          ) {
            this.urlTokenService.clearRecoveryTokens();
            this.hasValidTokens = false;
            this.errorMessage =
              'Session expired. Please request a new password reset.';
          }
        },
      });
  }

  requestNewReset() {
    this.urlTokenService.clearRecoveryTokens();
    this.router.navigate(['/password-reset']);
  }

  goBackToSignin() {
    this.urlTokenService.clearRecoveryTokens();
    this.router.navigate(['/signin']);
  }
}
