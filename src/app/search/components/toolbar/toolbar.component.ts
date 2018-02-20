import { FormControl } from '@angular/forms';
import { Hint } from './../../../core/typeahead-service/hints.model';
import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import * as fromSearch from './../../../+state/reducers/search.reducer';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  @Input() search: fromSearch.State;
  @Output() searchSelected = new EventEmitter<void>();
  @Output() query = new EventEmitter<string>();
  @Output() addFilter = new EventEmitter<Hint>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();
  mediaType = new FormControl();

  constructor() {}

  ngOnInit() {}
}
