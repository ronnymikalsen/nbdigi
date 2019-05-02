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
import { storeFreeze } from 'ngrx-store-freeze';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { environment } from '../environments/environment';
import { AppEffects } from './+state/app/app.effects';
import { AppFacade } from './+state/app/app.facade';
import {
  appReducer,
  initialState as appInitialState
} from './+state/app/app.reducer';
import { AuthEffects } from './+state/auth/auth.effects';
import { AuthFacade } from './+state/auth/auth.facade';
import { authReducer, AUTH_FEATURE_KEY } from './+state/auth/auth.reducer';
import { FavoriteEffects } from './+state/favorite/favorite.effects';
import { FavoriteFacade } from './+state/favorite/favorite.facade';
import {
  favoriteReducer,
  FAVORITE_FEATURE_KEY
} from './+state/favorite/favorite.reducer';
import { HomeEffects } from './+state/home/home.effects';
import { HomeFacade } from './+state/home/home.facade';
import { homeReducer, HOME_FEATURE_KEY } from './+state/home/home.reducer';
import { ItemEffects } from './+state/item/item.effects';
import { ItemFacade } from './+state/item/item.facade';
import { itemReducer, ITEM_FEATURE_KEY } from './+state/item/item.reducer';
import { debug } from './+state/metaReducer';
import { SearchEffects } from './+state/search/search.effects';
import { SearchFacade } from './+state/search/search.facade';
import {
  searchReducer,
  SEARCH_FEATURE_KEY
} from './+state/search/search.reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/guards';
import { CustomSerializer } from './custom-serializer';
import { SharedModule } from './shared/shared.module';
import { ViewerModule } from './shared/viewer/viewer.module';
import {
  MYACTIVITY_FEATURE_KEY,
  initialState as myActivityInitialState,
  myActivityReducer
} from './+state/my-activity/my-activity.reducer';
import { MyActivityEffects } from './+state/my-activity/my-activity.effects';
import { MyActivityFacade } from './+state/my-activity/my-activity.facade';

registerLocaleData(localeNo);

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    NxModule.forRoot(),
    CoreModule,
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
    StoreModule.forFeature(HOME_FEATURE_KEY, homeReducer),
    EffectsModule.forFeature([HomeEffects]),
    StoreModule.forFeature(FAVORITE_FEATURE_KEY, favoriteReducer),
    EffectsModule.forFeature([FavoriteEffects]),
    StoreModule.forFeature(SEARCH_FEATURE_KEY, searchReducer),
    EffectsModule.forFeature([SearchEffects]),
    StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
    EffectsModule.forFeature([AuthEffects]),
    StoreModule.forFeature(ITEM_FEATURE_KEY, itemReducer),
    EffectsModule.forFeature([ItemEffects]),
    StoreModule.forRoot(
      { app: appReducer },
      {
        initialState: { app: appInitialState },
        metaReducers: !environment.production ? [storeFreeze, debug] : [debug]
      }
    ),
    EffectsModule.forRoot([AppEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forFeature(MYACTIVITY_FEATURE_KEY, myActivityReducer, {
      initialState: myActivityInitialState
    }),
    EffectsModule.forFeature([MyActivityEffects])
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
    AuthFacade,
    ItemFacade,
    AppFacade,
    MyActivityFacade
  ]
})
export class AppModule {}
