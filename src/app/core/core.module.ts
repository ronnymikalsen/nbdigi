import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth-service/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { CheckForUpdateService } from './check-for-update-service/check-for-update.service';
import { CustomHttp } from './custom-http';
import { FavoriteService } from './favorite-service/favorite.service';
import { SearchService } from './search-service/search.service';
import { SessionService } from './session-service/session.service';
import { SwUpdateMessageComponent } from './sw-update-message/sw-update-message.component';
import { TypeaheadService } from './typeahead-service/typeahead.service';
import { ViewerService } from './viewer-service/viewer.service';

export function httpFactory(handler: HttpHandler) {
  return new CustomHttp(handler);
}

@NgModule({
  imports: [HttpClientModule, SharedModule],
  declarations: [SwUpdateMessageComponent],
  providers: [
    { provide: HttpClient, useFactory: httpFactory, deps: [HttpHandler] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    SessionService,
    SearchService,
    TypeaheadService,
    FavoriteService,
    ViewerService,
    CheckForUpdateService,
    AngularFireDatabase
  ],
  entryComponents: [SwUpdateMessageComponent]
})
export class CoreModule {}
