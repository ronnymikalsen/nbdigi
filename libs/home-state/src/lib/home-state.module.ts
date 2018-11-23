import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  HOME_FEATURE_KEY,
  initialState as homeInitialState,
  homeReducer
} from './+state/home.reducer';
import { HomeEffects } from './+state/home.effects';
import { HomeFacade } from './+state/home.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(HOME_FEATURE_KEY, homeReducer, {
      initialState: homeInitialState
    }),
    EffectsModule.forFeature([HomeEffects])
  ],
  providers: [HomeFacade]
})
export class HomeStateModule {}
