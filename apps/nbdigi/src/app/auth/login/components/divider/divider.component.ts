import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'nbd-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DividerComponent {
  @Input()
  color = 'primary';
}
