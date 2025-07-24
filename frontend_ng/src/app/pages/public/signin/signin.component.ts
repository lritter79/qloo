import { Component, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  signinForm = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required),
  });
  isLoading: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (this.signinForm.valid) {
      this.isLoading = true;

      this.authService
        .login({
          email: this.signinForm.value.email ?? '',
          password: this.signinForm.value.password ?? '',
        })
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            // Redirect to dashboard or intended route
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            alert(error?.message);
          },
        });
    }
  }
}
