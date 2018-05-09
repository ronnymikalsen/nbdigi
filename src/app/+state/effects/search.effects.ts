import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  mergeMap,
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
  filter
} from 'rxjs/operators';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import * as fromRoot from './../reducers';
import * as search from '../actions/search.actions';
import { TypeaheadService } from './../../core/typeahead-service/typeahead.service';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import { SearchCriteria } from '../../models/search-criteria.model';
import { SearchService } from './../../core/search-service/search.service';
import { Criteria } from './../../models/criteria';
import { User } from '../../models/user.model';

@Injectable()
export class SearchEffects {
  private criteriasRef: AngularFirestoreCollection<Criteria>;

  @Effect()
  search: Observable<Action> = this.actions
    .ofType(search.SearchActionTypes.Search)
    .pipe(
      tap(() => this.router.navigate(['/search'])),
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const hints = new Hints();
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
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        this.criteriasRef
          .doc(<string>storeState.search.criteria.hash)
          .set(hint);

        if (storeState.search.criteria.mediaType === 'alle') {
          return this.searchService
            .super({
              size: 20,
              q: storeState.search.criteria.q,
              filters: filters,
              sort: storeState.search.criteria.sort
            })
            .pipe(
              map(searchResult => {
                return new search.SearchSuccess(searchResult);
              }),
              catchError(err => Observable.of(new search.SearchError(err)))
            );
        } else {
          return this.searchService
            .search({
              size: 50,
              mediaType: storeState.search.criteria.mediaType,
              q: storeState.search.criteria.q,
              filters: filters,
              sort: storeState.search.criteria.sort
            })
            .pipe(
              map(searchResult => {
                return new search.SearchSuccess(searchResult);
              }),
              catchError(err => Observable.of(new search.SearchError(err)))
            );
        }
      })
    );

  @Effect()
  searchAggregator: Observable<Action> = this.actions
    .ofType(
      search.SearchActionTypes.SearchSuccess,
      search.SearchActionTypes.SearchAggs
    )
    .pipe(
      withLatestFrom(this.store),
      switchMap(([action, storeState]) => {
        const hints = new Hints();
        const filters = this.addAllFilters(storeState);

        return this.searchService
          .search({
            size: 1,
            q: storeState.search.criteria.q,
            filters: filters,
            sort: storeState.search.criteria.sort
          })
          .pipe(
            map(searchResult => {
              return new search.SearchAggsSuccess(searchResult);
            }),
            catchError(err => Observable.of(new search.SearchAggsError(err)))
          );
      })
    );

  @Effect()
  loadMore: Observable<Action> = this.actions
    .ofType(search.SearchActionTypes.LoadMore)
    .pipe(
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
        } else if (
          storeState.search.criteria.mediaType === 'programrapporter'
        ) {
          url = storeState.search.searchResult.programReports.nextLink;
        } else if (storeState.search.criteria.mediaType === 'others') {
          url = storeState.search.searchResult.others.nextLink;
        }
        return this.searchService
          .searchByUrl(storeState.search.criteria.mediaType, url)
          .pipe(
            map(searchResult => {
              return new search.LoadMoreSuccess(searchResult);
            }),
            catchError(err => {
              return Observable.of(new search.SearchError(err));
            })
          );
      })
    );

  @Effect({ dispatch: false })
  error: Observable<Action> = this.actions
    .ofType(search.SearchActionTypes.SearchError)
    .pipe(
      tap(() => {
        this.snackBar.open('Det har oppstått en feil', null, {
          duration: 2000,
          panelClass: 'error'
        });
      })
    );

  @Effect()
  loadHints: Observable<Action> = this.actions
    .ofType(search.SearchActionTypes.LoadHints)
    .pipe(
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
            return new search.HintsLoaded(hints);
          })
        );
      })
    );

  constructor(
    private router: Router,
    private store: Store<fromRoot.State>,
    private actions: Actions,
    private typeaheadService: TypeaheadService,
    private searchService: SearchService,
    public snackBar: MatSnackBar,
    private afs: AngularFirestore
  ) {
    this.store
      .select(fromRoot.currentUser)
      .pipe(filter(user => user !== null))
      .subscribe((user: User) => {
        this.criteriasRef = afs
          .collection('users')
          .doc(user.uid)
          .collection('searchs');
      });
  }

  private addAllFilters(storeState): string[] {
    let filters = [
      ...storeState.search.criteria.filters
        .filter(h => h.enabled)
        .map(h => h.value)
    ];

    if (
      storeState.session.user.uid !== '8Ntufmqo1RhCYMbmWv1Ocz156ts1' &&
      storeState.session.user.uid !== 'dr2snqxHiZRSEkCUUOOfw6pFkJm2' &&
      storeState.session.user.uid !== 'iHr3SCdKewU6M3bNGLMUwqxvDu73' &&
      storeState.session.user.uid !== 'V9q3474Py0PfJx8zKeQ3DHlmklR2'
    ) {
      filters = [
        ...filters,
        'contentClasses:ccbyncnd OR contentClasses:publicdomain OR contentClasses:ccbync'
      ];
    }
    filters = [...filters, 'digital:Ja'];
    filters = [...filters, 'contentClasses:jp2'];

    return filters;
  }
}
