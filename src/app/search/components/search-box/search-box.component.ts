import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { Hints, Hint } from './../../../core/typeahead-service/hints.model';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;
  public queryControl: FormControl;
  @Input()  hints: Hints;
  @Output() hintSelected = new EventEmitter<Hint>();
  @Output() query = new EventEmitter<string>();
  private destroyed: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.queryControl.valueChanges.pipe(takeUntil(this.destroyed), startWith(''), debounceTime(300)).subscribe(val => {
      this.query.emit(val);      
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onSubmit() {
    console.log('searching');
  }

  clear(): void {
    this.queryControl.patchValue('');
  }

  displayFn(value: Hint): string {
    return value.label;
  }

  optionSelected(selected: MatAutocompleteSelectedEvent): void {
    this.hintSelected.emit(selected.option.value);
    this.clear();
  }

  private createForm() {
    this.queryControl = new FormControl('');
    this.searchForm = this.fb.group({
      q: this.queryControl
    });
  }
}
