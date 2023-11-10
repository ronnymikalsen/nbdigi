import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { SearchState } from '../../../+state/search/search.reducer';
import {
  DateOption,
  DateOptions,
  Genre,
  GenreOptions,
  Sort,
  SortOptions,
} from '../../../core/models';
import { Hint } from '../../../core/models/hints.model';

@Component({
  selector: 'nbd-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input() search!: SearchState | null;
  @Input() currentMediaTypeCount!: number | null;
  @Input() showDateGraph!: boolean | null;
  @Input() isDebugOn!: boolean | null;
  @Output() searchSelected = new EventEmitter<string>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() addFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();
  @Output() mediaTypeChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<Sort>();
  @Output() genreChanged = new EventEmitter<Genre>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @Output() openDatePicker = new EventEmitter<boolean>();
  @Output() dateGraphChanged = new EventEmitter<boolean>();
  @Output() dateChanged = new EventEmitter<DateOption>();
  @ViewChild('mediatypeMenuButton', { static: true })
  mediatypeMenu!: MatMenuTrigger;

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
      this.mediatypeControl.setValue(this.search?.criteria.mediaType);
      this.sortControl.setValue(this.search?.criteria.sort);
      this.genreControl.setValue(this.search?.criteria.genre);
      this.dateControl.setValue(this.search?.criteria.date);
    }
  }

  changeMediatype(selected: string | undefined | null) {
    this.mediatypeMenu.closeMenu();
    if (selected) {
      this.mediaTypeChanged.emit(selected);
    }
  }
}
