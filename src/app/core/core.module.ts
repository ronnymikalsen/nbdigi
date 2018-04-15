import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpHandler
} from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth-service/auth.service';
import { TypeaheadService } from './typeahead-service/typeahead.service';
import { SearchService } from './search-service/search.service';
import { CustomHttp } from './custom-http';
import { ViewerService } from './viewer-service/viewer.service';
import { CheckForUpdateService } from './check-for-update-service/check-for-update.service';
import { SwUpdateMessageComponent } from './sw-update-message/sw-update-message.component';
import { SharedModule } from '../shared/shared.module';
import { FavoriteService } from './favorite-service/favorite.service';

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
