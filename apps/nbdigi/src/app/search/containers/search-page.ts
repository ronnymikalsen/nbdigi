import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AppFacade } from '../../+state/app/app.facade';
import { ItemFacade } from '../../+state/item/item.facade';
import { SearchFacade } from '../../+state/search/search.facade';
import { SearchState } from '../../+state/search/search.reducer';
import {
  Criteria,
  DateOption,
  Genre,
  MediaTypeResults,
  Sort,
  YearCount,
} from '../../core/models';
import { Hint } from '../../core/models/hints.model';
import { ChartRangeToOption } from '../components/search-result-chart/chart-strategy-factory';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-search
      [search]="search | async"
      [currentMediaTypeCount]="currentMediaTypeCount | async"
      [pristine]="pristine | async"
      [books]="books | async"
      [newspapers]="newspapers | async"
      [photos]="photos | async"
      [periodicals]="periodicals | async"
      [maps]="maps | async"
      [musicBooks]="musicBooks | async"
      [musicManuscripts]="musicManuscripts | async"
      [posters]="posters | async"
      [privateArchives]="privateArchives | async"
      [programReports]="programReports | async"
      [others]="others | async"
      [years]="years | async"
      [months]="months | async"
      [moreUrl]="moreUrl | async"
      [showDateGraph]="showDateGraph | async"
      [showItemDetails]="showItemDetails | async"
      [isDebugOn]="isDebugOn | async"
      (searchSelected)="searchSelected($event)"
      (addFilter)="addFilter($event)"
      (removeFilter)="removeFilter($event)"
      (toggleFilter)="toggleFilter($event)"
      (mediaTypeChanged)="mediaTypeChanged($event)"
      (sortChanged)="sortChanged($event)"
      (genreChanged)="genreChanged($event)"
      (debugChanged)="debugChanged($event)"
      (dateChanged)="dateChanged($event)"
      (dateGraphChanged)="dateGraphChanged($event)"
      (chartDateChanged)="chartDateChanged($event)"
      (previousChartRange)="previousChartRange($event)"
      (currentChartChanged)="currentChartChanged($event)"
      (loadMore)="loadMore()"
    >
    </nbd-search>
  `,
})
export class SearchPageComponent implements OnInit, OnDestroy {
  search: Observable<SearchState> = this.searchFacade.state$;
  currentMediaTypeCount: Observable<number> =
    this.searchFacade.getCurrentMediaTypeCount$;
  books: Observable<MediaTypeResults> = this.searchFacade.getBooks$;
  newspapers: Observable<MediaTypeResults> = this.searchFacade.getNewspapers$;
  photos: Observable<MediaTypeResults> = this.searchFacade.getPhotos$;
  periodicals: Observable<MediaTypeResults> = this.searchFacade.getPeriodicals$;
  maps: Observable<MediaTypeResults> = this.searchFacade.getMaps$;
  musicBooks: Observable<MediaTypeResults> = this.searchFacade.getMusicBooks$;
  musicManuscripts: Observable<MediaTypeResults> =
    this.searchFacade.getMusicManuscripts$;
  posters: Observable<MediaTypeResults> = this.searchFacade.getPosters$;
  privateArchives: Observable<MediaTypeResults> =
    this.searchFacade.getPrivateArchives$;
  programReports: Observable<MediaTypeResults> =
    this.searchFacade.getProgramReports$;
  others: Observable<MediaTypeResults> = this.searchFacade.getOthers$;
  years: Observable<YearCount[]> = this.searchFacade.getYears$;
  months: Observable<YearCount[]> = this.searchFacade.getMonths$;
  moreUrl: Observable<string | null | undefined> =
    this.searchFacade.getMoreUrl$;
  pristine: Observable<boolean> = this.searchFacade.pristine$;
  isDebugOn: Observable<boolean> = this.appFacade.isDebugOn$;
  showDateGraph: Observable<boolean> = this.appFacade.showDateGraph$;
  showItemDetails: Observable<boolean> = this.itemFacade.showItemDetails$;

  constructor(
    private searchFacade: SearchFacade,
    private appFacade: AppFacade,
    private itemFacade: ItemFacade,
  ) {}

  ngOnInit() {
    this.searchFacade.searchAggs();
  }

  ngOnDestroy() {
    this.itemFacade.closeItemDetails();
  }

  toggleFilter(hint: Hint): void {
    this.searchFacade.toggleFilter(hint);
    this.searchFacade.search();
  }

  removeFilter(hint: Hint): void {
    this.searchFacade.removeFilter(hint);
    this.searchFacade.search();
  }

  addFilter(hint: Hint): void {
    this.searchFacade.addFilter(hint);
    this.searchFacade.search();
  }

  searchSelected(query: string): void {
    this.searchFacade.updateCriteria(
      new Criteria({
        q: query,
      }),
    );
    this.searchFacade.search();
  }

  mediaTypeChanged(mediaType: string | null): void {
    this.searchFacade.updateCriteria(
      new Criteria({
        mediaType: mediaType,
      }),
    );
    this.searchFacade.search();
  }

  sortChanged(sort: Sort): void {
    this.searchFacade.updateCriteria(
      new Criteria({
        sort: sort,
      }),
    );
    this.searchFacade.search();
  }

  genreChanged(genre: Genre): void {
    if (genre) {
      this.searchFacade.updateCriteria(
        new Criteria({
          genre: genre,
          mediaType: genre.mediaType,
        }),
      );
    } else {
      this.searchFacade.updateCriteria(
        new Criteria({
          genre: new Genre(),
        }),
      );
    }
    this.searchFacade.search();
  }

  debugChanged(debug: boolean): void {
    debug ? this.appFacade.debugOn() : this.appFacade.debugOff();
    this.searchFacade.search();
  }

  dateChanged(dateOption: DateOption): void {
    this.searchFacade.setDateCriteria(dateOption);
  }

  dateGraphChanged(value: boolean): void {
    value ? this.appFacade.showDateGraph() : this.appFacade.hideDateGraph();
  }

  chartDateChanged(dateOption: DateOption): void {
    this.searchFacade.setDateCriteria(dateOption);
  }

  currentChartChanged(name: string) {
    this.searchFacade.setCurrentChartName(name);
  }

  previousChartRange(chartBackOption: ChartRangeToOption) {
    this.searchFacade.toChartRange(chartBackOption);
  }

  loadMore(): void {
    this.searchFacade.loadMore();
  }
}
