import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  skipWhile,
  takeUntil
} from 'rxjs/operators';
import { Hint, Hints } from '../../../../core/models/hints.model';

@Component({
  selector: 'nbd-search-box-container',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit, OnChanges, OnDestroy {
  @Input() q: string;
  @Input() hints: Hints;
  @Output() hintSelected = new EventEmitter<Hint>();
  @Output() query = new EventEmitter<string>();
  @Output() searchSelected = new EventEmitter<string>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @Output() clearAll = new EventEmitter<boolean>();
  @ViewChild(MatAutocompleteTrigger, { static: true }) matAutocomplete: MatAutocompleteTrigger;
  @ViewChild('searchbox-container', { static: false }) searchboxContainer: ElementRef;
  public searchForm: FormGroup;
  public queryControl: FormControl;
  private destroyed: Subject<void> = new Subject();
  private timer: any;
  private preventSimpleClick: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['q']) {
      this.queryControl.patchValue(changes['q'].currentValue);
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
      this.queryControl.patchValue(q.trim());
      this.debugChanged.emit(true);
    } else if (q.toLocaleLowerCase().includes('debugoff')) {
      q = q.replace(/debugoff/gi, '');
      this.queryControl.patchValue(q.trim());
      this.debugChanged.emit(false);
    }
    this.matAutocomplete.closePanel();
    this.query.emit(q);
    this.searchSelected.emit(q);
  }

  clear(): void {
    this.timer = 0;
    this.preventSimpleClick = false;
    this.timer = setTimeout(() => {
      if (!this.preventSimpleClick) {
        this.queryControl.patchValue('');
        setTimeout(() => {
          if (this.searchboxContainer) {
            this.searchboxContainer.nativeElement.focus();
          }
        });
      }
    }, 200);
  }

  onClearAll(): void {
    this.preventSimpleClick = true;
    clearTimeout(this.timer);
    this.clearAll.emit();
  }

  displayFn(value?: any): string {
    return value instanceof Hint ? value.label : value;
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
