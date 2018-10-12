import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ItemActions } from 'src/app/+state/actions';
import * as favoriteActions from '../../../+state/actions/favorite.actions';
import * as fromRoot from '../../../+state/reducers';
import { FavoriteList } from '../../../models/favorite-list';
import { MediaTypeResults } from '../../../models/search-result.model';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit, OnDestroy {
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);
  favoriteLists: Observable<FavoriteList[]> = this.store.select(
    fromRoot.getFavoriteList
  );
  recentActivity: Observable<MediaTypeResults> = this.store
    .select(fromRoot.getFavoriteList)
    .pipe(
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
    public media: ObservableMedia
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.store.dispatch(new ItemActions.CloseItemDetails());
  }

  openFavorite(list: FavoriteList) {
    this.store.dispatch(new favoriteActions.OpenList(list.id));
  }
}
