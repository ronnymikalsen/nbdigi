import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppFacade } from '../../../+state/app/app.facade';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import { ItemFacade } from '../../../+state/item/item.facade';
import { FavoriteList, MediaTypeResults } from '../../../core/models';

@Component({
  templateUrl: './favorite-list-page.html',
  styleUrls: ['./favorite-list-page.scss'],
})
export class FavoriteListPageComponent implements OnInit, OnDestroy {
  items!: Observable<MediaTypeResults>;
  listId: string | null = null;
  isDebugOn: Observable<boolean> = this.appFacade.isDebugOn$;
  currentList: Observable<FavoriteList> = this.favoriteFacade.getCurrentList$;

  constructor(
    private route: ActivatedRoute,
    private favoriteFacade: FavoriteFacade,
    private appFacade: AppFacade,
    private itemFacade: ItemFacade,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.listId = params.get('id');

      if (this.listId) {
        this.favoriteFacade.openList(this.listId);
      }
    });

    this.items = this.favoriteFacade.getCurrentList$.pipe(
      filter((l) => l !== undefined),
      map((l: FavoriteList) => new MediaTypeResults({ items: l.items })),
    );
  }

  ngOnDestroy() {
    this.itemFacade.closeItemDetails();
  }
}
