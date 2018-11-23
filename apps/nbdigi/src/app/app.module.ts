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
import { FavoriteEffects } from './+state/effects/favorite.effects';
import { HomeEffects } from './+state/effects/home.effects';
import { ItemEffects } from './+state/effects/item.effects';
import { SearchEffects } from './+state/effects/search.effects';
import { SessionEffects } from './+state/effects/session.effects';
import { metaReducers, reducers } from './+state/reducers';
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
      HomeEffects,
      SearchEffects,
      ItemEffects,
      FavoriteEffects
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
    ViewerModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ]
})
export class AppModule {}
