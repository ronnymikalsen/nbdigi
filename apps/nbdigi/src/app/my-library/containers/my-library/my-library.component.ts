import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemActions } from '../../../+state/actions';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import * as fromRoot from '../../../+state/reducers';
import { SessionFacade } from '../../../+state/session/session.facade';
import { FavoriteList, MediaTypeResults } from '../../../core/models';

@Component({
  selector: 'nbd-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit, OnDestroy {
  isDebugOn: Observable<boolean> = this.sessionFacade.isDebugOn$;
  favoriteLists: Observable<FavoriteList[]> = this.favoriteFacade
    .getFavoriteList$;
  recentActivity: Observable<
    MediaTypeResults
  > = this.favoriteFacade.getFavoriteList$.pipe(
    map((favoriteLists: FavoriteList[]) => {
      let items = [];
      favoriteLists.forEach(l => {
        items = [...items, ...l.items];
      });
      items.sort(
        (a, b) =>
          (b.timestamp ? b.timestamp.toMillis() : 0) -
          (a.timestamp ? a.timestamp.toMillis() : 0)
      );
      return new MediaTypeResults({ items: items });
    })
  );

  showItemDetails: Observable<boolean> = this.store.select(
    fromRoot.showItemDetails
  );

  constructor(
    private store: Store<fromRoot.State>,
    public media: ObservableMedia,
    private favoriteFacade: FavoriteFacade,
    private sessionFacade: SessionFacade
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.store.dispatch(new ItemActions.CloseItemDetails());
  }

  openFavorite(list: FavoriteList) {
    this.favoriteFacade.openList(list.id);
  }
}
