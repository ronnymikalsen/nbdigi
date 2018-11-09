import { Component, OnInit } from '@angular/core';
import { Item } from '@nbdigi/data-models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ItemActions } from '../../../+state/actions';
import * as fromRoot from '../../../+state/reducers';
import { Manifest } from '../../../core/presentation-service/manifest';
import { ItemMenuButtonComponentConfig } from '../../item-menu/item-menu-button/item-menu-button.component';

@Component({
  selector: 'nbd-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  item$: Observable<Item>;
  manifest$: Observable<Manifest>;
  loading$: Observable<boolean>;
  config = new ItemMenuButtonComponentConfig({
    direction: 'horiz',
    enableShowDetails: false
  });

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.item$ = this.store.select(fromRoot.getCurrentItemDetails);
    this.manifest$ = this.store.select(fromRoot.getItemCurrentManifest);
    this.loading$ = this.store.select(fromRoot.getItemLoading);
  }

  close() {
    this.store.dispatch(new ItemActions.CloseItemDetails());
  }
}
