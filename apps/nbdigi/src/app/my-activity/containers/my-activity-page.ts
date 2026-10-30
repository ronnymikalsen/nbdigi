import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { Item, User } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <nbd-my-activity [items]="items | async"></nbd-my-activity> `,
  standalone: false,
})
export class MyActivityPageComponent implements OnInit {
  items!: Observable<Item[]>;

  constructor(
    private authFacade: AuthFacade,
    private afs: Firestore,
  ) {}

  ngOnInit() {
    this.items = this.authFacade.currentUser$
      .pipe(
        filter((user): user is User & { uid: string } => Boolean(user?.uid)),
        switchMap((user) => {
          const itemsRef = collection(
            this.afs,
            'users',
            user.uid,
            'items',
          ) as CollectionReference<Item>;
          return collectionData(
            query(itemsRef, orderBy('timestamp', 'desc')),
          ) as Observable<Item[]>;
        }),
      );
  }
}
