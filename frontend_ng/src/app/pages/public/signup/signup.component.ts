import { Component, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  confirmEmailValidator,
  confirmPasswordValidator,
} from './matchingValidators';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  template: `<form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <label for="name">Name: </label>
    <input id="name" type="text" formControlName="name" />
    <label for="email">Email: </label>
    <input id="email" type="email" formControlName="email" email />
    <div
      *ngIf="signupForm.get('email')?.dirty && signupForm.get('email')?.touched"
    >
      <span
        class="error-message"
        *ngIf="signupForm.get('email')?.hasError('email')"
      >
        Email Required
      </span>
    </div>
    <label for="confirmEmail">Confirm Email: </label>
    <input
      id="confirmEmail"
      type="email"
      formControlName="confirmEmail"
      email
    />
    <div>
      <span class="error-message" *ngIf="signupForm.errors?.['EmailNoMatch']">
        Email doesn't match.
      </span>
    </div>

    <label for="password">Password: </label>
    <input id="password" type="password" formControlName="password" />
    <div
      *ngIf="
        signupForm.get('password')?.dirty && signupForm.get('password')?.touched
      "
    >
      <span
        class="error-message"
        *ngIf="signupForm.get('password')?.hasError('required')"
      >
        Password Required
      </span>
    </div>
    <label for="confirmPassword">Password: </label>
    <input
      id="confirmPassword"
      type="password"
      formControlName="confirmPassword"
    />
    <div class="error-message" *ngIf="signupForm.errors?.['PasswordNoMatch']">
      Password doesn't match.
    </div>

    <button type="submit" [disabled]="!signupForm.valid">Submit</button>
  </form> `,
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading: boolean = false;
  signupForm = new FormGroup(
    {
      email: new FormControl('', Validators.email),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmEmail: new FormControl('', Validators.email),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: new FormControl('', Validators.required),
    },
    {
      validators: [confirmPasswordValidator, confirmEmailValidator],
    }
  );

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;

      this.authService
        .signup({
          name: this.signupForm.value.name ?? '',
          email: this.signupForm.value.email ?? '',
          password: this.signupForm.value.password ?? '',
        })
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            // Redirect to dashboard
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            alert(error.message);
          },
        });
    }
  }
}
