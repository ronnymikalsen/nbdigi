import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppFacade } from '../../../+state/app/app.facade';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import { ItemFacade } from '../../../+state/item/item.facade';
import { FavoriteList, MediaTypeResults } from '../../../core/models';

@Component({
  selector: 'nbd-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit, OnDestroy {
  isDebugOn: Observable<boolean> = this.appFacade.isDebugOn$;
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
    public media: MediaObserver,
    private favoriteFacade: FavoriteFacade,
    private appFacade: AppFacade,
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
