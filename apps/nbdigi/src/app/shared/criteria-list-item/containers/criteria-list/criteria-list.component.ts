import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
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
import { filter, switchMap } from 'rxjs/operators';
import { AuthFacade } from '../../../../+state/auth/auth.facade';
import { SearchFacade } from '../../../../+state/search/search.facade';
import { Criteria, User } from '../../../../core/models';

@Component({
  selector: 'nbd-criteria-list',
  templateUrl: './criteria-list.component.html',
  styleUrls: ['./criteria-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CriteriaListComponent implements OnInit {
  @Input() limit = 1000;
  criterias!: Observable<Criteria[]>;

  constructor(
    private afs: Firestore,
    private searchFacade: SearchFacade,
    private authFacade: AuthFacade,
  ) {}

  ngOnInit() {
    this.criterias = this.authFacade.currentUser$
      .pipe(
        filter((user): user is User & { uid: string } => Boolean(user?.uid)),
        switchMap((user) => {
          const criteriasRef = collection(
            this.afs,
            'users',
            user.uid,
            'searchs',
          ) as CollectionReference<Criteria>;
          return collectionData(
            query(
              criteriasRef,
              orderBy('timestamp', 'desc'),
              limit(this.limit),
            ),
          ) as Observable<Criteria[]>;
        }),
      );
  }

  changeCriteria(criteria: Criteria): void {
    this.searchFacade.setCriteria(criteria);
    this.searchFacade.search();
  }
}
