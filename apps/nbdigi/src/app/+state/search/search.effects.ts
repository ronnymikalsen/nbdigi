import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { Criteria, DateOption, DateOptions, User } from '../../core/models';
import { Hint, Hints } from '../../core/models/hints.model';
import { SearchService } from '../../core/services/search.service';
import { TypeaheadService } from '../../core/services/typeahead.service';
import { ChartRangeToOption } from '../../search/components/search-result-chart/chart-strategy-factory';
import { DatePickerDialogComponent } from '../../search/containers/date-picker-dialog/date-picker-dialog.component';
import { AuthFacade } from '../auth/auth.facade';
import { CloseItemDetails } from '../item/item.actions';
import {
  HintsLoaded,
  LoadMoreSuccess,
  Search,
  SearchActionTypes,
  SearchAggsSuccess,
  SearchError,
  SearchSuccess,
  SetDateCriteria,
  SetDateCriteriaCancelled,
  SetDateCriteriaConfirmed,
  ToChartRange
} from './search.actions';
import { SearchPartialState } from './search.reducer';

@Injectable()
export class SearchEffects {
  private criteriasRef: AngularFirestoreCollection<Criteria>;
  private user: User;

  @Effect()
  search: Observable<Action> = this.actions.pipe(
    ofType(SearchActionTypes.Search),
    tap(() => this.ngZone.run(() => this.router.navigate(['/search']))),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      const filters = this.addAllFilters(storeState);

      const hint = {
        ...storeState.search.criteria,
        filters: storeState.search.criteria.filters.map(obj => {
          return Object.assign({}, obj);
        }),
        sort: {
          value: storeState.search.criteria.sort.value,
          viewValue: storeState.search.criteria.sort.viewValue
        },
        date: storeState.search.criteria.date
          ? {
              value: storeState.search.criteria.date.value,
              viewValue: storeState.search.criteria.date.viewValue,
              fromDate: storeState.search.criteria.date.fromDate,
              toDate: storeState.search.criteria.date.toDate
            }
          : null,
        genre: storeState.search.criteria.genre
          ? {
              value: storeState.search.criteria.genre.value,
              viewValue: storeState.search.criteria.genre.viewValue
            }
          : null,
        timestamp: firebase.firestore.Timestamp.now()
      };
      const createHash = new Criteria(hint);
      this.criteriasRef.doc(<string>createHash.hash).set(hint);

      const isyearsearch =
        storeState.search.criteria.date &&
        storeState.search.criteria.date.fromDate &&
        storeState.search.criteria.date.toDate &&
        storeState.search.criteria.date.fromDate.substring(0, 4) ===
          storeState.search.criteria.date.toDate.substring(0, 4);

      const chartAggs = isyearsearch ? 'month:100' : 'year:999';

      if (storeState.search.criteria.mediaType === 'alle') {
        return this.searchService
          .super(
            {
              size: 20,
              q: storeState.search.criteria.q,
              filters: filters,
              sort: storeState.search.criteria.sort
            },
            [chartAggs]
          )
          .pipe(
            map(searchResult => {
              return new SearchSuccess(searchResult);
            }),
            catchError(err => of(new SearchError(err)))
          );
      } else {
        return this.searchService
          .search(
            {
              size: 50,
              mediaType: storeState.search.criteria.mediaType,
              q: storeState.search.criteria.q,
              filters: filters,
              sort: storeState.search.criteria.sort
            },
            [chartAggs]
          )
          .pipe(
            map(searchResult => {
              return new SearchSuccess(searchResult);
            }),
            catchError(err => of(new SearchError(err)))
          );
      }
    })
  );

  @Effect()
  searchAggregator: Observable<Action> = this.actions.pipe(
    ofType(SearchActionTypes.SearchAggs, SearchActionTypes.SearchSuccess),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      const filters = this.addAllFilters(storeState);

      const chartAggs = [];
      if (storeState.search.criteria.mediaType === 'alle') {
        const isyearsearch =
          storeState.search.criteria.date &&
          storeState.search.criteria.date.fromDate &&
          storeState.search.criteria.date.toDate &&
          storeState.search.criteria.date.fromDate.substring(0, 4) ===
            storeState.search.criteria.date.toDate.substring(0, 4);

        chartAggs.push(isyearsearch ? 'month:100' : 'year:999');
      }
      return this.searchService
        .search(
          {
            size: 1,
            q: storeState.search.criteria.q,
            filters: filters.filter(f => !f.startsWith('mediatype')),
            sort: storeState.search.criteria.sort
          },
          chartAggs
        )
        .pipe(
          map(searchResult => {
            return new SearchAggsSuccess(searchResult);
          }),
          catchError(err => of(new SearchError(err)))
        );
    })
  );

  @Effect()
  loadMore: Observable<Action> = this.actions.pipe(
    ofType(SearchActionTypes.LoadMore),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      let url: string;
      if (storeState.search.criteria.mediaType === 'bøker') {
        url = storeState.search.searchResult.books.nextLink;
      } else if (storeState.search.criteria.mediaType === 'bilder') {
        url = storeState.search.searchResult.photos.nextLink;
      } else if (storeState.search.criteria.mediaType === 'aviser') {
        url = storeState.search.searchResult.newspapers.nextLink;
      } else if (storeState.search.criteria.mediaType === 'tidsskrift') {
        url = storeState.search.searchResult.periodicals.nextLink;
      } else if (storeState.search.criteria.mediaType === 'kart') {
        url = storeState.search.searchResult.maps.nextLink;
      } else if (storeState.search.criteria.mediaType === 'noter') {
        url = storeState.search.searchResult.musicBooks.nextLink;
      } else if (
        storeState.search.criteria.mediaType === 'musikkmanuskripter'
      ) {
        url = storeState.search.searchResult.musicManuscripts.nextLink;
      } else if (storeState.search.criteria.mediaType === 'plakater') {
        url = storeState.search.searchResult.posters.nextLink;
      } else if (
        storeState.search.criteria.mediaType === 'privatarkivmateriale'
      ) {
        url = storeState.search.searchResult.privateArchives.nextLink;
      } else if (storeState.search.criteria.mediaType === 'programrapporter') {
        url = storeState.search.searchResult.programReports.nextLink;
      } else if (storeState.search.criteria.mediaType === 'others') {
        url = storeState.search.searchResult.others.nextLink;
      }
      return this.searchService
        .searchByUrl(storeState.search.criteria.mediaType, url)
        .pipe(
          map(searchResult => {
            return new LoadMoreSuccess(searchResult);
          }),
          catchError(err => {
            return of(new SearchError(err));
          })
        );
    })
  );

  @Effect()
  backToPreviousChartRange: Observable<Action> = this.actions.pipe(
    ofType<ToChartRange>(SearchActionTypes.ToChartRange),
    map(action => action.payload),
    map((date: ChartRangeToOption) => new SetDateCriteriaConfirmed(date.date)),
    catchError(err => of(new SearchError(err)))
  );

  @Effect()
  setCustomDate: Observable<Action> = this.actions.pipe(
    ofType(SearchActionTypes.SetDateCriteria),
    map(action => action),
    withLatestFrom(this.store),
    exhaustMap(([action, storeState]) => {
      const payload = (<SetDateCriteria>action).payload;
      if (payload.value !== new DateOptions().customDate.value) {
        return of(new SetDateCriteriaConfirmed(payload));
      } else {
        return this.dialog
          .open(DatePickerDialogComponent, {
            data: {
              item: storeState.search.criteria.date
            }
          })
          .afterClosed()
          .pipe(
            take(1),
            map(result => {
              if (result) {
                const viewFormat = 'll';
                const searchApiFormat = 'YYYYMMDD';
                const fromDate = result.fromDate
                  ? result.fromDate
                  : this.dateAdapter.createDate(1, 0, 1);
                const toDate = result.toDate
                  ? result.toDate
                  : this.dateAdapter.today();
                const fromDateSearchFormat = fromDate.format(searchApiFormat);
                const toDateSearchFormat = toDate.format(searchApiFormat);
                let dateViewLabel: string;
                if (result.fromDate && result.toDate) {
                  dateViewLabel = `${fromDate.format(
                    viewFormat
                  )} - ${toDate.format(viewFormat)}`;
                } else if (result.fromDate) {
                  dateViewLabel = `Etter ${fromDate.format(viewFormat)}`;
                } else {
                  dateViewLabel = `Før ${toDate.format(viewFormat)}`;
                }
                const date = new DateOption({
                  type: 'custom',
                  fromDate: fromDateSearchFormat,
                  toDate: toDateSearchFormat,
                  value: `date:[${fromDateSearchFormat} TO ${toDateSearchFormat}]`,
                  viewValue: `${dateViewLabel}`
                });
                return new SetDateCriteriaConfirmed(date);
              } else {
                return new SetDateCriteriaCancelled();
              }
            })
          );
      }
    }),
    catchError(err => of(new SearchError(err)))
  );

  @Effect()
  setDateCriteriaConfirmed: Observable<Action> = this.actions.pipe(
    ofType<SetDateCriteriaConfirmed>(
      SearchActionTypes.SetDateCriteriaConfirmed
    ),
    map(action => action.payload),
    map((date: DateOption) => new Search()),
    catchError(err => of(new SearchError(err)))
  );

  @Effect({ dispatch: false })
  error: Observable<Action> = this.actions.pipe(
    ofType(SearchActionTypes.SearchError),
    tap(() => {
      this.snackBar.open('Det har oppstått en feil', null, {
        duration: 2000,
        panelClass: 'error'
      });
    })
  );

  @Effect()
  loadHints: Observable<Action> = this.actions.pipe(
    ofType(SearchActionTypes.LoadHints),
    map((action: any) => action),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => {
      const hints = new Hints();
      const filters = this.addAllFilters(storeState);
      const sc = {
        size: 50,
        mediaType: storeState.search.criteria.mediaType,
        q: action.payload,
        filters: filters,
        sort: storeState.search.criteria.sort
      };
      return this.typeaheadService.creators(sc).pipe(
        map((h: Hint[]) => (hints.creators = h)),
        mergeMap(h => this.typeaheadService.places(sc)),
        map((h: Hint[]) => (hints.places = h)),
        map(() => {
          return new HintsLoaded(hints);
        })
      );
    })
  );

  @Effect()
  clearAll: Observable<Action> = this.actions.pipe(
    ofType(SearchActionTypes.ClearAll),
    map(() => new CloseItemDetails())
  );

  constructor(
    private ngZone: NgZone,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<SearchPartialState>,
    private actions: Actions,
    private typeaheadService: TypeaheadService,
    private searchService: SearchService,
    public snackBar: MatSnackBar,
    private afs: AngularFirestore,
    private dateAdapter: DateAdapter<MomentDateAdapter>,
    private authFacade: AuthFacade
  ) {
    this.authFacade.currentUser$
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.user = user;
        this.criteriasRef = afs
          .collection('users')
          .doc(user.uid)
          .collection('searchs');
      });
  }

  private addAllFilters(storeState: SearchPartialState): string[] {
    let filters = [
      ...storeState.search.criteria.filters
        .filter(h => h.enabled)
        .map(h => h.value)
    ];

    if (
      this.user &&
      this.user.uid !== '8Ntufmqo1RhCYMbmWv1Ocz156ts1' &&
      this.user.uid !== 'dr2snqxHiZRSEkCUUOOfw6pFkJm2' &&
      this.user.uid !== 'iHr3SCdKewU6M3bNGLMUwqxvDu73' &&
      this.user.uid !== 'V9q3474Py0PfJx8zKeQ3DHlmklR2'
    ) {
      filters = [
        ...filters,
        'contentClasses:ccbyncnd OR contentClasses:publicdomain OR contentClasses:ccbync OR contentClasses:cc0'
      ];
    }
    filters = [...filters, 'digital:Ja'];
    filters = [...filters, 'contentClasses:jp2'];

    if (
      storeState.search.criteria.genre &&
      storeState.search.criteria.genre.value
    ) {
      filters = [...filters, storeState.search.criteria.genre.value];
    }

    if (
      storeState.search.criteria.date &&
      storeState.search.criteria.date.value
    ) {
      filters = [...filters, storeState.search.criteria.date.value];
    }

    return filters;
  }
}
