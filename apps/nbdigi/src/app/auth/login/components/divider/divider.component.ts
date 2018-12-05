import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

@Component({
  selector: 'nbd-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent implements OnChanges, OnInit {
  @Input()
  color: string;
  className: string;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const color: SimpleChange = changes.color;
    this.className = color.currentValue === 'primary' ? 'mat-primary' : null;
  }
}
