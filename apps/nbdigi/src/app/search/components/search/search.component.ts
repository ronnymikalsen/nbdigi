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
  ViewChild
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
  YearCount
} from '../../../core/models';
import { Hint } from '../../../core/models/hints.model';

@Component({
  selector: 'nbd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnChanges {
  @Input() search: SearchState;
  @Input() criterias: Criteria[];
  @Input() currentMediaTypeCount: number;
  @Input() pristine: boolean;
  @Input() books = new MediaTypeResults();
  @Input() newspapers = new MediaTypeResults();
  @Input() photos = new MediaTypeResults();
  @Input() periodicals = new MediaTypeResults();
  @Input() maps = new MediaTypeResults();
  @Input() musicBooks = new MediaTypeResults();
  @Input() musicManuscripts = new MediaTypeResults();
  @Input() posters = new MediaTypeResults();
  @Input() privateArchives = new MediaTypeResults();
  @Input() programReports = new MediaTypeResults();
  @Input() others = new MediaTypeResults();
  @Input() years: YearCount[] = [];
  @Input() months: YearCount[] = [];
  @Input() moreUrl = null;
  @Input() isDebugOn: boolean;
  @Input() showDateGraph: boolean;
  @Input() chartRange: ChartOption;
  @Input() showItemDetails: boolean;
  @Output() searchSelected = new EventEmitter<string>();
  @Output() addFilter = new EventEmitter<Hint>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();
  @Output() mediaTypeChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<Sort>();
  @Output() genreChanged = new EventEmitter<Genre>();
  @Output() debugChanged = new EventEmitter<boolean>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() dateChanged = new EventEmitter<DateOption>();
  @Output() dateGraphChanged = new EventEmitter<boolean>();
  @Output() chartDateChanged = new EventEmitter<DateOption>();
  @Output() previousChartRange = new EventEmitter<ChartOption>();
  @Output() currentChartChanged = new EventEmitter<string>();
  @ViewChild('searchResultContainer', { static: true }) searchResultContainer: ElementRef;

  constructor(public media: MediaObserver) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['search']) {
      const searchResultHeight = document.querySelector('#search-container')
        .clientHeight;
      if (
        this.moreUrl &&
        !this.search.isLoading &&
        !this.search.isLoadingMore &&
        this.search.criteria.mediaType &&
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
    if (this.search.criteria.mediaType) {
      this.loadMore.emit();
    }
  }

  createLabel(mediaType: string, counts: number): string {
    return mediaType ? `${mediaType} (${counts})` : '';
  }
}
