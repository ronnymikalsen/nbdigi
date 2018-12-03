import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import { ItemFacade } from '../../../+state/item/item.facade';
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

  showItemDetails: Observable<boolean> = this.itemFacade.showItemDetails$;

  constructor(
    public media: ObservableMedia,
    private favoriteFacade: FavoriteFacade,
    private sessionFacade: SessionFacade,
    private itemFacade: ItemFacade
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.itemFacade.closeItemDetails();
  }

  openFavorite(list: FavoriteList) {
    this.favoriteFacade.openList(list.id);
  }
}
