import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiCommonModule } from '@nbdigi/ui-common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ItemEffects } from './+state/item.effects';
import { ItemFacade } from './+state/item.facade';
import {
  initialState as itemInitialState,
  itemReducer,
  ITEM_FEATURE_KEY
} from './+state/item.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ITEM_FEATURE_KEY, itemReducer, {
      initialState: itemInitialState
    }),
    EffectsModule.forFeature([ItemEffects]),
    UiCommonModule
  ],
  providers: [ItemFacade]
})
export class ItemStateModule {}
