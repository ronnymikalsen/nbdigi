import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Criteria, Item } from '../../../core/models';

@Component({
  selector: 'nbd-my-activity',
  templateUrl: './my-activity.component.html',
  styleUrls: ['./my-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MyActivityComponent implements OnInit {
  @Input() items!: Item[] | null;
  @Input() criterias!: Criteria | null;

  constructor() {}

  ngOnInit() {}
}
