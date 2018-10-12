import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ItemActions } from 'src/app/+state/actions';
import { Item } from 'src/app/models/search-result.model';
import * as fromRoot from '../../../+state/reducers';
import { Manifest } from '../../../core/presentation-service/manifest';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  item$: Observable<Item>;
  manifest$: Observable<Manifest>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.item$ = this.store.select(fromRoot.getCurrentItem);
    this.manifest$ = this.store.select(fromRoot.getItemCurrentManifest);
    this.loading$ = this.store.select(fromRoot.getItemLoading);
  }

  close() {
    this.store.dispatch(new ItemActions.CloseItemDetails());
  }
}
