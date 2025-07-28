import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
  imports: [RouterOutlet, PanelMenu],
})
export class PublicLayoutComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/home'],
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle',
      routerLink: ['/about'],
    },
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      routerLink: ['/signin'],
    },
    {
      label: 'Register',
      icon: 'pi pi-user-plus',
      routerLink: ['/signup'],
    },
  ];
}
