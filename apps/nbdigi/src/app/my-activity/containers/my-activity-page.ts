import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthFacade } from '../../+state/auth/auth.facade';
import { Item } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <nbd-my-activity [items]="items | async"></nbd-my-activity> `,
})
export class MyActivityPageComponent implements OnInit, OnDestroy {
  items!: Observable<Item[]>;
  private destroyed: Subject<void> = new Subject();

  constructor(
    private authFacade: AuthFacade,
    private afs: Firestore,
  ) {}

  ngOnInit() {
    this.authFacade.currentUser$
      .pipe(
        takeUntil(this.destroyed),
        filter((user) => user !== null),
      )
      .subscribe((user: any) => {
        /*
        this.items = this.afs
          .collection('users')
          .doc(user.uid)
          .collection<Item>('items', (ref: any) =>
            ref.orderBy('timestamp', 'desc')
          )
          .valueChanges();
          */
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
