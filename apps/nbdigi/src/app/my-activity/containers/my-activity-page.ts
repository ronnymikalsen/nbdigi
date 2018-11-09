import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Item, User } from '@nbdigi/data-models';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as fromRoot from '../../+state/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-my-activity [items]="items | async"></nbd-my-activity>
  `
})
export class MyActivityPageComponent implements OnInit, OnDestroy {
  items: Observable<Item[]>;
  private destroyed: Subject<void> = new Subject();

  constructor(
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromRoot.currentUser)
      .pipe(
        takeUntil(this.destroyed),
        filter(user => user !== null)
      )
      .subscribe((user: User) => {
        this.items = this.afs
          .collection('users')
          .doc(user.uid)
          .collection<Item>('items', ref => ref.orderBy('timestamp', 'desc'))
          .valueChanges();
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
