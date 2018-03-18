import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  distinctUntilChanged,
  filter
} from 'rxjs/operators';

import { Hints, Hint } from './../../../core/typeahead-service/hints.model';

@Component({
  selector: 'app-search-box-container',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit, OnDestroy, OnChanges {
  @Input() q: string;
  @Input() hints: Hints;
  @Output() hintSelected = new EventEmitter<Hint>();
  @Output() query = new EventEmitter<string>();
  @Output() searchSelected = new EventEmitter<string>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @ViewChild(MatAutocompleteTrigger) matAutocomplete: MatAutocompleteTrigger;
  public searchForm: FormGroup;
  public queryControl: FormControl;
  private destroyed: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.queryControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(f => f !== null),
        takeUntil(this.destroyed),
        skipWhile(val => val.length < 2),
        debounceTime(300)
      )
      .subscribe(val => this.query.emit(val));
    /* Material bug?
    this.route.paramMap
      .pipe(takeUntil(this.destroyed))
      .subscribe((params: ParamMap) => {
        this.queryControl.setValue(params.get('q'));
        this.cdr.detectChanges();
      });
      */
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['q']) {
      const curr = changes['q'].currentValue;
      if (curr) {
        /* Material bug?
        this.queryControl.setValue(curr);
        */
      }
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onSubmit() {
    let q: string = this.queryControl.value;
    if (q.toLocaleLowerCase().includes('debugon')) {
      q = q.replace(/debugon/gi, '');
      this.queryControl.setValue(q);
      this.debugChanged.emit(true);
    } else if (q.toLocaleLowerCase().includes('debugoff')) {
      q = q.replace(/debugoff/gi, '');
      this.queryControl.setValue(q);
      this.debugChanged.emit(false);
    }
    this.matAutocomplete.closePanel();
    this.query.emit(q);
    this.searchSelected.emit(q);
  }

  clear(): void {
    this.queryControl.patchValue('');
  }

  displayFn(value: Hint): string {
    return value ? value.label : null;
  }

  optionSelected(selected: MatAutocompleteSelectedEvent): void {
    this.hintSelected.emit(selected.option.value);
    this.clear();
  }

  private createForm() {
    this.queryControl = new FormControl(this.q ? this.q : '');
    this.searchForm = this.fb.group({
      q: this.queryControl
    });
  }
}
