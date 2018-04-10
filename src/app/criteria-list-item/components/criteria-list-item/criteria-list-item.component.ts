import { Criteria } from './../../../models/criteria';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-criteria-list-item',
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
