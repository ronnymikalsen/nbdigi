import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'nbd-media-type-option',
  templateUrl: './media-type-option.component.html',
  styleUrls: ['./media-type-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaTypeOptionComponent implements OnInit {
  @Input() mediaType: string | null | undefined;
  @Input() count: number = 0;
  @Input() checked: boolean = false;
  @Output() selected = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}
}
