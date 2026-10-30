import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Criteria } from '../../../../core/models';

@Component({
  selector: 'nbd-criteria-list-item',
  templateUrl: './criteria-list-item.component.html',
  styleUrls: ['./criteria-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CriteriaListItemComponent {
  @Input() criteria!: Criteria;
  @Output() changeCriteria = new EventEmitter<Criteria>();
}
