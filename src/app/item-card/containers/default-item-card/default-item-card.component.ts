import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from './../../../+state/reducers';
import * as itemAction from './../../../+state/actions/item.actions';
import { Item } from './../../../models/search-result.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-default-item-card',
  templateUrl: './default-item-card.component.html',
  styleUrls: ['./default-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultItemCardComponent implements OnInit {
  @Input() item: Item;
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  open(item: Item): void {
    this.store.dispatch(new itemAction.Open(item));
  }
}
