import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as itemAction from './../../../+state/actions/item.actions';
import * as fromRoot from './../../../+state/reducers';
import { Item } from './../../../models/search-result.model';
import { FavoriteList } from '../../../models/favorite-list';

@Component({
  selector: 'app-default-item-card',
  templateUrl: './default-item-card.component.html',
  styleUrls: ['./default-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultItemCardComponent implements OnInit {
  @Input() item: Item;
  @Input() list: FavoriteList;
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  open(item: Item): void {
    this.store.dispatch(new itemAction.Open(item));
  }
}
