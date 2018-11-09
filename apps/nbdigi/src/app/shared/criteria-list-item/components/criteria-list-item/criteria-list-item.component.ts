import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Criteria } from '@nbdigi/data-models';

@Component({
  selector: 'nbd-criteria-list-item',
  templateUrl: './criteria-list-item.component.html',
  styleUrls: ['./criteria-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CriteriaListItemComponent implements OnInit {
  @Input() criteria: Criteria;
  @Output() changeCriteria = new EventEmitter<Criteria>();

  constructor() {}

  ngOnInit() {}
}
