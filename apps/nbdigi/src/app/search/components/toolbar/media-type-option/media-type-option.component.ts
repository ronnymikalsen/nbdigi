import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'nbd-media-type-option',
  templateUrl: './media-type-option.component.html',
  styleUrls: ['./media-type-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MediaTypeOptionComponent {
  @Input() mediaType: string | null | undefined;
  @Input() count = 0;
  @Input() checked = false;
}
