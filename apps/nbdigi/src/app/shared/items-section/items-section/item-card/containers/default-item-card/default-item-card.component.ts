import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as itemAction from '../../../../../../+state/actions/item.actions';
import * as fromRoot from '../../../../../../+state/reducers';
import { SessionFacade } from '../../../../../../+state/session/session.facade';
import { FavoriteList, Item } from '../../../../../../core/models';

@Component({
  selector: 'nbd-default-item-card',
  templateUrl: './default-item-card.component.html',
  styleUrls: ['./default-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultItemCardComponent implements OnInit {
  @Input() item: Item;
  @Input() list: FavoriteList;
  isDebugOn: Observable<boolean> = this.sessionFacade.isDebugOn$;

  constructor(
    private store: Store<fromRoot.State>,
    private sessionFacade: SessionFacade
  ) {}

  ngOnInit() {}

  open(item: Item): void {
    this.store.dispatch(new itemAction.Open(item));
  }
}
