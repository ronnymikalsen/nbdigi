import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  SESSION_FEATURE_KEY,
  initialState as sessionInitialState,
  sessionReducer
} from './+state/session.reducer';
import { SessionEffects } from './+state/session.effects';
import { SessionFacade } from './+state/session.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(SESSION_FEATURE_KEY, sessionReducer, {
      initialState: sessionInitialState
    }),
    EffectsModule.forFeature([SessionEffects])
  ],
  providers: [SessionFacade]
})
export class SessionStateModule {}
