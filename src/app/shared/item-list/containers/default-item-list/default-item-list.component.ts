import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as itemAction from './../../../../+state/actions/item.actions';
import * as fromRoot from './../../../../+state/reducers';
import { Item } from './../../../../models/search-result.model';

@Component({
  selector: 'app-default-item-list',
  templateUrl: './default-item-list.component.html',
  styleUrls: ['./default-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultItemListComponent implements OnInit {
  @Input() item: Item;
  @Input() config = new DefaultItemListComponentConfig();
  isDebugOn: Observable<boolean> = this.store.select(fromRoot.isDebugOn);

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  open(item: Item): void {
    this.store.dispatch(new itemAction.Open(item));
  }
}

export class DefaultItemListComponentConfig {
  showMediaType? = true;
}
