import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ItemActions } from '../../../+state/actions';
import * as favoriteActions from '../../../+state/actions/favorite.actions';
import * as fromRoot from '../../../+state/reducers';
import { FavoriteList, MediaTypeResults } from '../../../core/models';
import { FavoriteService } from '../../../core/services/favorite.service';

@Component({
  templateUrl: './favorite-list-page.html',
  styleUrls: ['./favorite-list-page.scss']
})
export class FavoriteListPageComponent implements OnInit, OnDestroy {
  items: Observable<MediaTypeResults>;
  listId: string;
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);
  currentList: Observable<FavoriteList> = this.store.select(
    fromRoot.getCurrentList
  );

  constructor(
    private route: ActivatedRoute,
    private favoriteService: FavoriteService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.listId = params.get('id');
      this.store.dispatch(new favoriteActions.OpenList(this.listId));
    });

    this.items = this.store.select(fromRoot.getCurrentList).pipe(
      filter(l => l !== undefined),
      map((l: FavoriteList) => new MediaTypeResults({ items: l.items }))
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new ItemActions.CloseItemDetails());
  }
}
