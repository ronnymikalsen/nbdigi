import { FormControl } from '@angular/forms';
import { Hint } from './../../../core/typeahead-service/hints.model';
import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as fromSearch from './../../../+state/reducers/search.reducer';
import { SortOptions, Sort } from './../../../models/sort-options';
import { Genre, GenreOptions } from '../../../models/genre-options.model';
import { DateOptions, DateOption } from '../../../models/date-options';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input() search: fromSearch.State;
  @Input() currentMediaTypeCount: number;
  @Input() isDebugOn: boolean;
  @Output() searchSelected = new EventEmitter<string>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();
  @Output() mediaTypeChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<Sort>();
  @Output() genreChanged = new EventEmitter<Genre>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @Output() openDatePicker = new EventEmitter<boolean>();
  @Output() dateChanged = new EventEmitter<DateOption>();
  mediaType = new FormControl();
  sortControl = new FormControl();
  sortOptions = new SortOptions().all;
  genreControl = new FormControl();
  genreOptions = new GenreOptions().all;
  dateControl = new FormControl();
  dateOptions = new DateOptions().all;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['search']) {
      this.mediaType.setValue(this.search.criteria.mediaType);
      this.sortControl.setValue(this.search.criteria.sort);
      this.genreControl.setValue(this.search.criteria.genre);
      this.dateControl.setValue(this.search.criteria.date);
    }
  }

  sortCompareFn(c1: Sort, c2: Sort): boolean {
    return c1 && c2 ? c1.value === c2.value : c1 === c2;
  }

  genreCompareFn(c1: Genre, c2: Genre): boolean {
    return c1 && c2 ? c1.value === c2.value : c1 === c2;
  }

  dateCompareFn(c1: DateOption, c2: DateOption): boolean {
    return c1 && c2 ? c1.value === c2.value : c1 === c2;
  }
}
