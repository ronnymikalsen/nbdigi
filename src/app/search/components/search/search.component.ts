import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';

import * as fromSearch from './../../../+state/reducers/search.reducer';
import { Hint } from './../../../core/typeahead-service/hints.model';
import { SuperSearchResult, Item } from '../../../models/search-result.model';
import { MediaTypeResults } from './../../../models/search-result.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @Input() search: fromSearch.State;
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
  @Input() moreUrl = null;
  @Output() searchSelected = new EventEmitter<void>();
  @Output() query = new EventEmitter<string>();
  @Output() addFilter = new EventEmitter<Hint>();
  @Output() removeFilter = new EventEmitter<Hint>();
  @Output() toggleFilter = new EventEmitter<Hint>();
  @Output() itemSelected = new EventEmitter<Item>();
  @Output() mediatypeSelected = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>();
  @ViewChild('searchResultContainer') searchResultContainer: ElementRef;
  selector = '.search-result-container';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  searching() {
    this.searchSelected.emit();
    setTimeout(() => this.searchResultContainer.nativeElement.focus());
  }

  onMediaTypeSelected(selected: string) {
    this.mediatypeSelected.emit(selected);
  }

  onScroll() {
    if (this.search.mediaType) {
      this.loadMore.emit();
    }
  }

  createLabel(mediaType: string, counts: number): string {
    return mediaType ? `${mediaType.toUpperCase()} (${counts})` : '';
  }
}
