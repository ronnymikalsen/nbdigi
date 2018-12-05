import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { Item, User } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-my-activity [items]="items | async"></nbd-my-activity>
  `
})
export class MyActivityPageComponent implements OnInit, OnDestroy {
  items: Observable<Item[]>;
  private destroyed: Subject<void> = new Subject();

  constructor(private authFacade: AuthFacade, private afs: AngularFirestore) {}

  ngOnInit() {
    this.authFacade.currentUser$
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
