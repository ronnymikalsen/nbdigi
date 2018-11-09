import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'nbd-media-type-button',
  templateUrl: './media-type-button.component.html',
  styleUrls: ['./media-type-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaTypeButtonComponent implements OnInit {
  @Input() mediaType: string;
  @Input() counts: number;
  @Output() selected = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}
}
