import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import * as searchAction from './../../../../+state/actions/search.actions';
import * as fromRoot from './../../../../+state/reducers';
import { Criteria } from './../../../../models/criteria';
import { User } from './../../../../models/user.model';

@Component({
  selector: 'app-criteria-list',
  templateUrl: './criteria-list.component.html',
  styleUrls: ['./criteria-list.component.scss']
})
export class CriteriaListComponent implements OnInit, OnDestroy {
  @Input() limit = 1000;
  criterias: Observable<Criteria[]>;
  private destroyed: Subject<void> = new Subject();

  constructor(
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromRoot.currentUser)
      .pipe(takeUntil(this.destroyed), filter(user => user !== null))
      .subscribe((user: User) => {
        this.criterias = this.afs
          .collection('users')
          .doc(user.uid)
          .collection<Criteria>('searchs', ref =>
            ref.orderBy('timestamp', 'desc').limit(this.limit)
          )
          .valueChanges();
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  changeCriteria(criteria: Criteria): void {
    this.store.dispatch(new searchAction.SetCriteria(criteria));
    this.store.dispatch(new searchAction.Search());
  }
}
