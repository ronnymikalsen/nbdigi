import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import * as fromSearch from './../../../+state/reducers/search.reducer';
import { Hint } from './../../../core/typeahead-service/hints.model';
import { SuperSearchResult } from '../../../models/search-result.model';
import { MediaTypeResults } from './../../../models/search-result.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @Input() search: fromSearch.State;
  @Input() books = new MediaTypeResults();
  @Input() newspapers = new MediaTypeResults();
  @Input() photos = new MediaTypeResults();
  @Input() periodicals = new MediaTypeResults();
  @Input() others = new MediaTypeResults();
  @Output() searchSelected = new EventEmitter<void>();
  @Output() query = new EventEmitter<string>();
  @Output() addFilter = new EventEmitter<Hint>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();

  constructor() {}

  ngOnInit() {}

}
