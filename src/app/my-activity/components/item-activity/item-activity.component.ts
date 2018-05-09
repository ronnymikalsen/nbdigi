import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable } from 'rxjs';

import { Item } from './../../../models/search-result.model';

@Component({
  selector: 'app-item-activity',
  templateUrl: './item-activity.component.html',
  styleUrls: ['./item-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemActivityComponent implements OnInit {
  @Input() items: Observable<Item[]>;

  constructor() {}

  ngOnInit() {}
}
