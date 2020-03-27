import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchState } from '../../../+state/search/search.reducer';
import {
  DateOption,
  DateOptions,
  Genre,
  GenreOptions,
  Sort,
  SortOptions
} from '../../../core/models';
import { Hint } from '../../../core/models/hints.model';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'nbd-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input() search: SearchState;
  @Input() currentMediaTypeCount: number;
  @Input() showDateGraph: boolean;
  @Input() isDebugOn: boolean;
  @Output() searchSelected = new EventEmitter<string>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();
  @Output() mediaTypeChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<Sort>();
  @Output() genreChanged = new EventEmitter<Genre>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @Output() openDatePicker = new EventEmitter<boolean>();
  @Output() dateGraphChanged = new EventEmitter<boolean>();
  @Output() dateChanged = new EventEmitter<DateOption>();
  @ViewChild('mediatypeMenuButton', { static: true }) mediatypeMenu: MatMenuTrigger;

  mediatypeControl = new FormControl();
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
      this.mediatypeControl.setValue(this.search.criteria.mediaType);
      this.sortControl.setValue(this.search.criteria.sort);
      this.genreControl.setValue(this.search.criteria.genre);
      this.dateControl.setValue(this.search.criteria.date);
    }
  }

  changeMediatype(selected: string) {
    this.mediatypeMenu.closeMenu();
    this.mediaTypeChanged.emit(selected);
  }
}
