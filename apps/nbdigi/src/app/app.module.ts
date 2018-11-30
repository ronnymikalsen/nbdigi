import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/nx';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import 'hammerjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { environment } from '../environments/environment';
import { AuthEffects } from './+state/auth/auth.effects';
import { AuthFacade } from './+state/auth/auth.facade';
import {
  authReducer,
  AUTH_FEATURE_KEY,
  initialState as authInitialState
} from './+state/auth/auth.reducer';
import { ItemEffects } from './+state/effects/item.effects';
import { SessionEffects } from './+state/effects/session.effects';
import { FavoriteEffects } from './+state/favorite/favorite.effects';
import { FavoriteFacade } from './+state/favorite/favorite.facade';
import {
  favoriteReducer,
  FAVORITE_FEATURE_KEY,
  initialState as favoriteInitialState
} from './+state/favorite/favorite.reducer';
import { HomeEffects } from './+state/home/home.effects';
import { HomeFacade } from './+state/home/home.facade';
import {
  homeReducer,
  HOME_FEATURE_KEY,
  initialState as homeInitialState
} from './+state/home/home.reducer';
import { metaReducers, reducers } from './+state/reducers';
import { SearchEffects } from './+state/search/search.effects';
import { SearchFacade } from './+state/search/search.facade';
import {
  initialState as searchInitialState,
  searchReducer,
  SEARCH_FEATURE_KEY
} from './+state/search/search.reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/guards';
import { CustomSerializer } from './custom-serializer';
import { SharedModule } from './shared/shared.module';
import { ViewerModule } from './viewer/viewer.module';

registerLocaleData(localeNo);

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    NxModule.forRoot(),
    CoreModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      SessionEffects,
      ItemEffects,
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    StoreRouterConnectingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    InfiniteScrollModule,
    NgxChartsModule,
    SharedModule,
    ViewerModule,
    StoreModule.forFeature(HOME_FEATURE_KEY, homeReducer, {
      initialState: homeInitialState
    }),
    EffectsModule.forFeature([HomeEffects]),
    StoreModule.forFeature(FAVORITE_FEATURE_KEY, favoriteReducer, {
      initialState: favoriteInitialState
    }),
    EffectsModule.forFeature([FavoriteEffects]),
    StoreModule.forFeature(SEARCH_FEATURE_KEY, searchReducer, {
      initialState: searchInitialState
    }),
    EffectsModule.forFeature([SearchEffects]),
    StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer, {
      initialState: authInitialState
    }),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    },
    HomeFacade,
    FavoriteFacade,
    SearchFacade,
    AuthFacade
  ]
})
export class AppModule {}
