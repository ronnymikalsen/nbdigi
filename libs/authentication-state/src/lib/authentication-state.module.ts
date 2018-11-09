import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  AUTHENTICATIONSTATE_FEATURE_KEY,
  initialState as authenticationstateInitialState,
  authenticationstateReducer
} from './+state/authenticationstate.reducer';
import { AuthenticationstateEffects } from './+state/authenticationstate.effects';
import { AuthenticationstateFacade } from './+state/authenticationstate.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      AUTHENTICATIONSTATE_FEATURE_KEY,
      authenticationstateReducer,
      { initialState: authenticationstateInitialState }
    ),
    EffectsModule.forFeature([AuthenticationstateEffects])
  ],
  providers: [AuthenticationstateFacade]
})
export class AuthenticationStateModule {}
