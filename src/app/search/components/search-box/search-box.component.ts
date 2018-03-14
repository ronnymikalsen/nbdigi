import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  map,
  takeUntil,
  debounceTime,
  skipWhile,
  distinctUntilChanged
} from 'rxjs/operators';

import { Hints, Hint } from './../../../core/typeahead-service/hints.model';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() hints: Hints;
  @Output() hintSelected = new EventEmitter<Hint>();
  @Output() query = new EventEmitter<string>();
  @Output() searchSelected = new EventEmitter<void>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @ViewChild(MatAutocompleteTrigger) matAutocomplete: MatAutocompleteTrigger;
  public searchForm: FormGroup;
  public queryControl = new FormControl('');
  private destroyed: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.queryControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroyed),
        skipWhile(val => val.length < 2),
        debounceTime(300)
      )
      .subscribe(val => this.query.emit(val));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onSubmit() {
    let q: string = this.queryControl.value;
    if (q.includes('debugon')) {
      q = q.replace('debugon', '');
      this.queryControl.setValue(q);
      this.debugChanged.emit(true);
    } else if (q.includes('debugoff')) {
      q = q.replace('debugoff', '');
      this.queryControl.setValue(q);
      this.debugChanged.emit(false);
    }
    this.matAutocomplete.closePanel();
    this.query.emit(q);
    this.searchSelected.emit();
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
    this.searchForm = this.fb.group({
      q: this.queryControl
    });
  }
}
