import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Item } from '@nbdigi/data-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'nbd-item-activity',
  templateUrl: './item-activity.component.html',
  styleUrls: ['./item-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemActivityComponent implements OnInit {
  @Input() items: Observable<Item[]>;

  constructor() {}

  ngOnInit() {}
}
