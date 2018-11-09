import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UiMaterialModule } from '@nbdigi/ui-material';
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
import { AppEffects } from './+state/app.effects';
import {
  appReducer,
  initialState as appInitialState
} from './+state/app.reducer';
import { FavoriteEffects } from './+state/effects/favorite.effects';
import { HomeEffects } from './+state/effects/home.effects';
import { ItemEffects } from './+state/effects/item.effects';
import { SearchEffects } from './+state/effects/search.effects';
import { SessionEffects } from './+state/effects/session.effects';
import { metaReducers, reducers } from './+state/reducers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CustomSerializer } from './custom-serializer';
import { SharedModule } from './shared/shared.module';
import { ViewerModule } from './viewer/viewer.module';

registerLocaleData(localeNo);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    NxModule.forRoot(),
    CoreModule,
    AppRoutingModule,
    StoreModule.forRoot(
      { app: appReducer },
      {
        initialState: { app: appInitialState },
        metaReducers: !environment.production ? [storeFreeze] : []
      }
    ),
    EffectsModule.forRoot([AppEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule,
    FlexLayoutModule,
    UiMaterialModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      SessionEffects,
      HomeEffects,
      SearchEffects,
      ItemEffects,
      FavoriteEffects
    ]),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    InfiniteScrollModule,
    NgxChartsModule,
    SharedModule,
    ViewerModule
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule {}
