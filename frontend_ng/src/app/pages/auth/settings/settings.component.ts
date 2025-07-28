import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-settings',
  imports: [Button],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [UserService],
})
export class SettingsComponent {
  message: string = '';
  //inject user service
  constructor(private userService: UserService, private router: Router) {}

  deleteAccount() {
    this.userService.deleteUserAccount().subscribe({
      next: () => {
        // Clear session storage and redirect to home
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        this.message = err.error?.message || 'Failed to delete account';
      },
    });
  }
}
