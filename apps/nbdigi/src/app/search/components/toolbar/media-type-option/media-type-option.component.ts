import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'nbd-media-type-option',
  templateUrl: './media-type-option.component.html',
  styleUrls: ['./media-type-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaTypeOptionComponent implements OnInit {
  @Input() mediaType: string;
  @Input() count: number;
  @Input() checked: boolean;
  @Output() selected = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}
}
