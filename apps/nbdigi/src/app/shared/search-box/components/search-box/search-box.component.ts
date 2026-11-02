import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  skipWhile,
  takeUntil,
} from 'rxjs/operators';
import { Hint, Hints } from '../../../../core/models/hints.model';
import { Criteria } from '../../../../core/models';
import {
  SearchChatMessage,
  SearchChatFilter,
} from '../../../../core/services/chat-search.service';

@Component({
  selector: 'nbd-search-box-container',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SearchBoxComponent implements OnInit, OnChanges, OnDestroy {
  @Input() q!: string | null;
  @Input() chatOnly = false;
  @Input() showAiSearchLink = true;
  @Input() hints!: Hints | undefined;
  @Input() activeCriteria: Criteria | null = null;
  @Input() messages: readonly SearchChatMessage[] = [];
  @Input() pending = false;
  @Input() chatError = '';
  @Input() pendingLabel = 'Tenker …';
  @Input() canUndo = false;
  @Output() chatSubmitted = new EventEmitter<string>();
  @Output() undoRequested = new EventEmitter<void>();
  @Output() filterRemoved = new EventEmitter<SearchChatFilter>();
  @Output() newestRequested = new EventEmitter<void>();
  chatMode = false;
  @Output() hintSelected = new EventEmitter<Hint>();
  @Output() query = new EventEmitter<string>();
  @Output() searchSelected = new EventEmitter<string>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @Output() clearAll = new EventEmitter<boolean>();
  @ViewChild(MatAutocompleteTrigger)
  matAutocomplete?: MatAutocompleteTrigger;
  @ViewChild('composer') searchboxContainer?: ElementRef<HTMLInputElement>;
  @ViewChildren('chatTurn') chatTurns?: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('resultArea') resultArea?: ElementRef<HTMLElement>;
  @ViewChild('chatHistory') chatHistory?: ElementRef<HTMLDivElement>;
  private displayedMessages: readonly SearchChatMessage[] = [];
  public searchForm!: FormGroup;
  public queryControl!: FormControl;
  private destroyed: Subject<void> = new Subject();
  private timer: any;
  private preventSimpleClick!: boolean;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.queryControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((f) => f !== null),
        takeUntil(this.destroyed),
        skipWhile((val) => val.length < 2),
        debounceTime(300),
      )
      .subscribe((val) => {
        if (!this.chatMode) this.query.emit(val);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatOnly']) {
      this.setChatMode(this.chatOnly);
    }
    if (changes['q'] && !this.chatMode) {
      this.queryControl.patchValue(changes['q'].currentValue);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngAfterViewChecked(): void {
    if (this.chatHistory && this.displayedMessages !== this.messages) {
      if (this.messages.at(-1)?.role === 'assistant') {
        this.chatTurns?.last?.nativeElement.scrollIntoView?.({
          block: 'start',
        });
      } else {
        this.searchboxContainer?.nativeElement.scrollIntoView?.({
          block: 'nearest',
        });
      }
      this.displayedMessages = this.messages;
    }
  }

  onSubmit() {
    let q: string = (this.queryControl.value ?? '').trim();
    if (this.chatMode) {
      if (!q || q.length > 1000 || this.pending) return;
      this.chatSubmitted.emit(q);
      this.queryControl.setValue('', { emitEvent: false });
      return;
    }
    if (q.toLocaleLowerCase().includes('debugon')) {
      q = q.replace(/debugon/gi, '');
      this.queryControl.patchValue(q.trim());
      this.debugChanged.emit(true);
    } else if (q.toLocaleLowerCase().includes('debugoff')) {
      q = q.replace(/debugoff/gi, '');
      this.queryControl.patchValue(q.trim());
      this.debugChanged.emit(false);
    }
    this.matAutocomplete?.closePanel();
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
    this.queryControl.setValue('', { emitEvent: false });
    this.clearAll.emit();
  }

  setChatMode(enabled: boolean): void {
    this.chatMode = enabled;
    this.queryControl.setValue(enabled ? '' : this.q ?? '', {
      emitEvent: false,
    });
  }

  defaultResultLimit(): number {
    // The history has 4px padding on each side; grid tracks are at least 160px with 8px gaps.
    const width = Math.max(
      0,
      (this.resultArea?.nativeElement.getBoundingClientRect().width ?? 0) - 8,
    );
    const columns =
      width > 0 && width <= 260
        ? 1
        : width <= 540
        ? 2
        : Math.floor((width + 8) / 168);
    return Math.max(1, columns) * 2;
  }

  submitFollowUp(text: string): void {
    if (this.pending) return;
    this.chatSubmitted.emit(text);
  }

  draftFollowUp(text: string): void {
    if (this.pending) return;
    this.queryControl.setValue(text, { emitEvent: false });
    this.searchboxContainer?.nativeElement.focus();
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
      q: this.queryControl,
    });
  }
}
