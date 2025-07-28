import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

// PrimeNG Imports
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarModule,
    ButtonModule,
    MenubarModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <!-- Enhanced Navigation Bar -->
    <p-toolbar
      class="main-toolbar"
      [style]="{ 'border-radius': '0px', padding: '1rem 1rem 1rem 1.5rem' }"
    >
      <div class="p-toolbar-group-start">
        <h3 class="app-title">Your App</h3>
      </div>

      <div class="p-toolbar-group-center">
        <span class="nav-text">Authenticated Navigation</span>
      </div>

      <div class="p-toolbar-group-end">
        <!-- Theme Toggle Button -->
        <!-- <p-button
          [icon]="currentTheme === 'light' ? 'pi pi-moon' : 'pi pi-sun'"
          [label]="currentTheme === 'light' ? 'Dark' : 'Light'"
          severity="secondary"
          [outlined]="true"
          size="small"
          (click)="toggleTheme()"
          class="theme-toggle"
        >
        </p-button> -->
        <p-button
          icon="pi pi-sign-out"
          label="Settings"
          [outlined]="true"
          size="small"
          (click)="navigateToSettings()"
          class="logout-btn"
        >
        </p-button>
        <!-- Logout Button -->
        <p-button
          icon="pi pi-sign-out"
          label="Logout"
          severity="danger"
          [outlined]="true"
          size="small"
          (click)="logout()"
          [loading]="isLoggingOut"
          class="logout-btn"
        >
        </p-button>
      </div>
    </p-toolbar>
    <div class="auth-layout" [attr.data-theme]="currentTheme">
      <!-- Main Content Area -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Toast for notifications -->
      <p-toast position="top-right"></p-toast>
    </div>
  `,
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  currentTheme: 'light' | 'dark' = 'light';
  isLoggingOut = false;

  ngOnInit() {
    this.loadTheme();
    this.applyTheme();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.saveTheme();
    this.applyTheme();

    this.messageService.add({
      severity: 'info',
      summary: 'Theme Changed',
      detail: `Switched to ${this.currentTheme} theme`,
      life: 2000,
    });
  }

  private loadTheme() {
    // For actual implementation, replace this with:
    // const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark';
    // this.currentTheme = savedTheme || 'light';

    // In-memory storage for demo (replace with localStorage in your project)
    this.currentTheme = (window as any).appTheme || 'light';
  }

  private saveTheme() {
    // For actual implementation, replace this with:
    // localStorage.setItem('app-theme', this.currentTheme);

    // In-memory storage for demo (replace with localStorage in your project)
    (window as any).appTheme = this.currentTheme;
  }

  private applyTheme() {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${this.currentTheme}-theme`);

    // Update CSS custom properties for theme colors
    const root = document.documentElement;
    if (this.currentTheme === 'dark') {
      root.style.setProperty('--surface-ground', '#121212');
      root.style.setProperty('--surface-section', '#1e1e1e');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--text-color-secondary', '#a0a0a0');
    } else {
      root.style.setProperty('--surface-ground', '#ffffff');
      root.style.setProperty('--surface-section', '#f8f9fa');
      root.style.setProperty('--text-color', '#212529');
      root.style.setProperty('--text-color-secondary', '#6c757d');
    }
  }

  //nav to settings page
  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.isLoggingOut = true;

    this.authService.logout().subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Logged Out',
          detail: 'You have been successfully logged out',
          life: 3000,
        });

        // Redirect to login or public route instead of chat
        this.router.navigate(['/login']);
        this.isLoggingOut = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Logout Failed',
          detail: error?.message || 'An error occurred during logout',
          life: 5000,
        });
        this.isLoggingOut = false;
      },
    });
  }
}
