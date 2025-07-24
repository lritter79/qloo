import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppBar } from "../app-bar/app-bar.component";

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, AppBar],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

}
