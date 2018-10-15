import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Item } from 'src/app/models/search-result.model';
import * as itemAction from '../../../../+state/actions/item.actions';
import * as fromRoot from '../../../../+state/reducers';
@Component({
  selector: 'app-item-details-head',
  templateUrl: './item-details-head.component.html',
  styleUrls: ['./item-details-head.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsHeadComponent implements OnInit {
  @Input() item: Item;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {}

  open(item: Item): void {
    this.store.dispatch(new itemAction.Open(item));
  }
}
