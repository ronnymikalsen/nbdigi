import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'nbd-media-type-button',
  templateUrl: './media-type-button.component.html',
  styleUrls: ['./media-type-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaTypeButtonComponent implements OnInit {
  @Input() mediaType!: string | null | undefined;
  @Input() counts!: number | undefined;
  @Output() selected = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}
}
