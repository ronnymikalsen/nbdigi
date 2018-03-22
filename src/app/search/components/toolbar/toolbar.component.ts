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
  @Output() sortChanged = new EventEmitter<string>();
  @Output() debugChanged = new EventEmitter<boolean>();
  mediaType = new FormControl();
  sortControl = new FormControl();
  sortOptions = [
    { value: '_score,desc', viewValue: 'Relevans' },
    { value: 'title,asc', viewValue: 'Tittel A-Å' },
    { value: 'title,desc', viewValue: 'Tittel Å-A' },
    { value: 'date,asc', viewValue: 'Eldste først' },
    { value: 'date,desc', viewValue: 'Nyeste først' },
    { value: 'firstDigitalContentTime,desc', viewValue: 'Nyankommet' }
  ];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['search']) {
      this.mediaType.setValue(this.search.criteria.mediaType);
      this.sortControl.setValue(this.search.criteria.sort);
    }
  }
}
