import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Criteria } from './../../../models/criteria';

@Component({
  selector: 'app-search-activity',
  templateUrl: './search-activity.component.html',
  styleUrls: ['./search-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchActivityComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
