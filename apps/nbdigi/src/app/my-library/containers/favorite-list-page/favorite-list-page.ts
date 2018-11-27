import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ItemActions } from '../../../+state/actions';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import * as fromRoot from '../../../+state/reducers';
import { FavoriteList, MediaTypeResults } from '../../../core/models';

@Component({
  templateUrl: './favorite-list-page.html',
  styleUrls: ['./favorite-list-page.scss']
})
export class FavoriteListPageComponent implements OnInit, OnDestroy {
  items: Observable<MediaTypeResults>;
  listId: string;
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);
  currentList: Observable<FavoriteList> = this.favoriteFacade.getCurrentList$;

  constructor(
    private route: ActivatedRoute,
    private favoriteFacade: FavoriteFacade,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.listId = params.get('id');
      this.favoriteFacade.openList(this.listId);
    });

    this.items = this.favoriteFacade.getCurrentList$.pipe(
      filter(l => l !== undefined),
      map((l: FavoriteList) => new MediaTypeResults({ items: l.items }))
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new ItemActions.CloseItemDetails());
  }
}
