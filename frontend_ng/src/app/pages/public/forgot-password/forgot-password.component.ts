import { Component, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    CardModule,
  ],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  passwordResetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isLoading = false;
  isSubmitted = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  onSubmit() {
    if (this.passwordResetForm.invalid) return;

    this.isLoading = true;

    this.authService
      .resetPassword({
        email: this.passwordResetForm.value.email ?? '',
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isSubmitted = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Reset Email Sent',
            detail: 'Please check your email for password reset instructions',
          });
        },
        error: (err: { message: any }) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Reset Failed',
            detail:
              err.message || 'Unable to send reset email. Please try again.',
          });
        },
      });
  }

  goBackToSignin() {
    this.router.navigate(['/signin']);
  }

  resendEmail() {
    this.isSubmitted = false;
    this.onSubmit();
  }
}
