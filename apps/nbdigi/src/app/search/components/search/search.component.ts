import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { SearchState } from '../../../+state/search/search.reducer';
import {
  ChartOption,
  Criteria,
  DateOption,
  Genre,
  MediaTypeResults,
  Sort,
  YearCount,
} from '../../../core/models';
import { Hint } from '../../../core/models/hints.model';
import { ChartRangeToOption } from '../search-result-chart/chart-strategy-factory';

@Component({
  selector: 'nbd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnChanges {
  @Input() search!: SearchState | null;
  @Input() criterias!: Criteria[];
  @Input() currentMediaTypeCount!: number | null;
  @Input() pristine!: boolean | null;
  @Input() books: MediaTypeResults | null = new MediaTypeResults();
  @Input() newspapers: MediaTypeResults | null = new MediaTypeResults();
  @Input() photos: MediaTypeResults | null = new MediaTypeResults();
  @Input() periodicals: MediaTypeResults | null = new MediaTypeResults();
  @Input() maps: MediaTypeResults | null = new MediaTypeResults();
  @Input() musicBooks: MediaTypeResults | null = new MediaTypeResults();
  @Input() musicManuscripts: MediaTypeResults | null = new MediaTypeResults();
  @Input() posters: MediaTypeResults | null = new MediaTypeResults();
  @Input() privateArchives: MediaTypeResults | null = new MediaTypeResults();
  @Input() programReports: MediaTypeResults | null = new MediaTypeResults();
  @Input() others: MediaTypeResults | null = new MediaTypeResults();
  @Input() years: YearCount[] | null = [];
  @Input() months: YearCount[] | null = [];
  @Input() moreUrl: string | null | undefined = null;
  @Input() isDebugOn!: boolean | null;
  @Input() showDateGraph!: boolean | null;
  @Input() chartRange!: ChartOption;
  @Input() showItemDetails!: boolean | null;
  @Output() searchSelected = new EventEmitter<string>();
  @Output() addFilter = new EventEmitter<Hint>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();
  @Output() mediaTypeChanged = new EventEmitter<string | null>();
  @Output() sortChanged = new EventEmitter<Sort>();
  @Output() genreChanged = new EventEmitter<Genre>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() dateChanged = new EventEmitter<DateOption>();
  @Output() dateGraphChanged = new EventEmitter<boolean>();
  @Output() chartDateChanged = new EventEmitter<DateOption>();
  @Output() previousChartRange = new EventEmitter<ChartRangeToOption>();
  @Output() currentChartChanged = new EventEmitter<string>();
  @ViewChild('searchResultContainer', { static: true })
  searchResultContainer!: ElementRef;

  constructor(public media: MediaObserver) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['search']) {
      const searchResultHeight = document
        ? document.querySelector('#search-container')?.clientHeight
        : 0;
      if (
        this.moreUrl &&
        this.search &&
        !this.search.isLoading &&
        !this.search.isLoadingMore &&
        this.search.criteria.mediaType &&
        searchResultHeight &&
        document.body.clientHeight > searchResultHeight
      ) {
        this.loadMore.emit();
      }
    }
  }

  searching(q: string) {
    this.searchSelected.emit(q);
    setTimeout(() => this.searchResultContainer.nativeElement.focus());
  }

  onScroll() {
    if (this.search && this.search.criteria.mediaType) {
      this.loadMore.emit();
    }
  }

  createLabel(
    mediaType: string | null | undefined,
    counts: string | null
  ): string {
    return mediaType ? `${mediaType} (${counts})` : '';
  }
}
