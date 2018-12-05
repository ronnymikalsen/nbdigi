import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthFacade } from '../../../../+state/auth/auth.facade';
import { SearchFacade } from '../../../../+state/search/search.facade';
import { Criteria, User } from '../../../../core/models';

@Component({
  selector: 'nbd-criteria-list',
  templateUrl: './criteria-list.component.html',
  styleUrls: ['./criteria-list.component.scss']
})
export class CriteriaListComponent implements OnInit, OnDestroy {
  @Input() limit = 1000;
  criterias: Observable<Criteria[]>;
  private destroyed: Subject<void> = new Subject();

  constructor(
    private afs: AngularFirestore,
    private searchFacade: SearchFacade,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.authFacade.currentUser$
      .pipe(
        takeUntil(this.destroyed),
        filter(user => user !== null)
      )
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
    this.searchFacade.setCriteria(criteria);
    this.searchFacade.search();
  }
}
