import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Item, MediaTypeResults } from '../../../models/search-result.model';
import * as favoriteActions from './../../../+state/actions/favorite.actions';
import * as fromRoot from './../../../+state/reducers';
import { FavoriteList } from './../../../models/favorite-list';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit {
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

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  openFavorite(list: FavoriteList) {
    this.store.dispatch(new favoriteActions.OpenList(list.id));
  }
}
