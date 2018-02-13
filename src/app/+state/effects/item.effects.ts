import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from './../reducers';
import { Item } from '../../models/search-result.model';
import { ItemActionTypes, Open } from '../actions/item.actions';
import { tap, map, switchMap } from 'rxjs/operators';
import { ViewerService } from '../../core/viewer-service/viewer.service';

@Injectable()
export class ItemEffects {
  @Effect({ dispatch: false })
  open: Observable<Action> = this.actions
    .ofType(ItemActionTypes.Open)
    .pipe(
      map(action => action),
      tap((action: Open) => this.viewerService.open(action.payload))
    );

  constructor(private actions: Actions, private viewerService: ViewerService) {}
}
