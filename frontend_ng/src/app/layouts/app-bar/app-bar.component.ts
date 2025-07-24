import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { TuiAppBar } from '@taiga-ui/layout';

@Component({
  selector: 'app-bar',
  standalone: true,
  exportAs: 'appBar',
  imports: [TuiAppBar, TuiTitle],
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBar {}
