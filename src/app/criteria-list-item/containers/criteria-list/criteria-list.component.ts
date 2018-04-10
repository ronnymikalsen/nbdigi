import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil, filter } from 'rxjs/operators';

import { User } from './../../../models/user.model';
import { Criteria } from './../../../models/criteria';
import * as fromRoot from './../../../+state/reducers';
import * as searchAction from './../../../+state/actions/search.actions';

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
