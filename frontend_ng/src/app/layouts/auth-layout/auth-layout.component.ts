import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AppBar } from "../app-bar/app-bar.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, AppBar],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  authService = new AuthService();
  router: any;
  logout() {
    console.log('logout');
    this.authService.logout().subscribe({
      next: (response) => {
        // Redirect to dashboard or intended route
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        alert(error?.message);
      },
    });
  }
}
