import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AppFacade } from '../../+state/app/app.facade';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { HomeFacade } from '../../+state/home/home.facade';
import { ItemFacade } from '../../+state/item/item.facade';
import { SearchFacade } from '../../+state/search/search.facade';
import {
  Criteria,
  Item,
  MediaTypeResults,
  SortOptions,
  User,
} from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-home
      [items]="items | async"
      [newBooks]="newBooks | async"
      [newPeriodicals]="newPeriodicals | async"
      [newPhotos]="newPhotos | async"
      [newNewspapers]="newNewspapers | async"
      [newOthers]="newOthers | async"
      [showItemDetails]="showItemDetails | async"
      [isDebugOn]="isDebugOn | async"
      (showMoreBooks)="onShowMoreBooks()"
      (showMorePeriodicals)="onShowMorePeriodicals()"
      (showMorePhotos)="onShowMorePhotos()"
      (showMoreNewspapers)="onShowMoreNewspapers()"
      (searchSelected)="onSearchSelected($event)"
    >
    </nbd-home>
  `,
  standalone: false,
})
export class HomePageComponent implements OnInit, OnDestroy {
  items: Observable<MediaTypeResults> = this.authFacade.currentUser$.pipe(
    filter((user): user is User & { uid: string } => Boolean(user?.uid)),
    switchMap((user) => {
      const itemsRef = collection(
        this.afs,
        'users',
        user.uid,
        'items',
      ) as CollectionReference<Item>;
      const recentItems = query(
        itemsRef,
        orderBy('timestamp', 'desc'),
        limit(20),
      );
      return collectionData(recentItems) as Observable<Item[]>;
    }),
    map((items) => new MediaTypeResults({ items })),
  );
  newBooks: Observable<MediaTypeResults> = this.homeFacade.getNewBooks$;
  newPeriodicals: Observable<MediaTypeResults> =
    this.homeFacade.getNewPeriodicals$;
  newPhotos: Observable<MediaTypeResults> = this.homeFacade.getNewPhotos$;
  newNewspapers: Observable<MediaTypeResults> =
    this.homeFacade.getNewNewspapers$;
  newOthers: Observable<MediaTypeResults> = this.homeFacade.getNewOthers$;
  isDebugOn: Observable<boolean> = this.appFacade.isDebugOn$;
  showItemDetails: Observable<boolean> = this.itemFacade.showItemDetails$;

  constructor(
    private homeFacade: HomeFacade,
    private searchFacade: SearchFacade,
    private appFacade: AppFacade,
    private authFacade: AuthFacade,
    private itemFacade: ItemFacade,
    private afs: Firestore,
  ) {}

  ngOnInit() {
    this.homeFacade.loadNewItems();
  }

  ngOnDestroy() {
    this.itemFacade.closeItemDetails();
  }

  onShowMoreBooks() {
    this.showNewArrivals('bøker');
  }

  onShowMorePeriodicals() {
    this.showNewArrivals('tidsskrift');
  }

  onShowMorePhotos() {
    this.showNewArrivals('bilder');
  }

  onShowMoreNewspapers() {
    this.showNewArrivals('aviser');
  }

  onSearchSelected(q: string) {
    this.searchFacade.setCriteria(
      new Criteria({
        q: q,
      }),
    );
    this.searchFacade.search();
  }

  private showNewArrivals(mediaType: string) {
    this.searchFacade.setCriteria(
      new Criteria({
        mediaType: mediaType,
        sort: new SortOptions().newArrivals,
      }),
    );
    this.searchFacade.search();
  }
}
