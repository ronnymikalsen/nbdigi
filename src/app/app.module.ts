import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { NgModule } from '@angular/core';
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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
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
import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';
import { CustomSerializer } from './custom-serializer';
import { SharedModule } from './shared/shared.module';
import { ViewerModule } from './viewer/viewer.module';

registerLocaleData(localeNo);

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
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
  ],
  exports: []
})
export class AppModule {}
