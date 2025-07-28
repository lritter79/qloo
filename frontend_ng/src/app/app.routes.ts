// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      {
        path: 'signin',
        loadComponent: () =>
          import('./pages/public/signin/signin.component').then(
            (m) => m.SigninComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/public/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import(
            './pages/public/forgot-password/forgot-password.component'
          ).then((m) => m.ForgotPasswordComponent),
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'chat',
        loadComponent: () =>
          import('./pages/auth/chat/chat.component').then(
            (m) => m.ChatbotComponent
          ),
      },
      {
        path: 'chat/:id',
        loadComponent: () =>
          import('./pages/auth/chat/chat.component').then(
            (m) => m.ChatbotComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/auth/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
