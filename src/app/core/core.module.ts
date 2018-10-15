import { ItemDetailsComponent } from './../shared/item-details/item-details/item-details.component';
import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DatePickerDialogComponent } from '../search/containers/date-picker-dialog/date-picker-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth-service/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { CheckForUpdateService } from './check-for-update-service/check-for-update.service';
import { CustomHttp } from './custom-http';
import { DateAdapter as CustomDateAdapter } from './date-adapter';
import { FavoriteService } from './favorite-service/favorite.service';
import { ItemDetailsService } from './item-details-service/item-details.service';
import { PresentationService } from './presentation-service/presentation.service';
import { SearchService } from './search-service/search.service';
import { SessionService } from './session-service/session.service';
import { SwUpdateMessageComponent } from './sw-update-message/sw-update-message.component';
import { TypeaheadService } from './typeahead-service/typeahead.service';
import { ViewerService } from './viewer-service/viewer.service';
import { ItemDetailsModule } from '../shared/item-details/item-details.module';

export function httpFactory(handler: HttpHandler) {
  return new CustomHttp(handler);
}

@NgModule({
  imports: [HttpClientModule, SharedModule, ItemDetailsModule],
  declarations: [SwUpdateMessageComponent, DatePickerDialogComponent],
  providers: [
    { provide: HttpClient, useFactory: httpFactory, deps: [HttpHandler] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'no-NB' },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    AuthService,
    SessionService,
    SearchService,
    TypeaheadService,
    FavoriteService,
    ViewerService,
    CheckForUpdateService,
    PresentationService,
    ItemDetailsService
  ],
  entryComponents: [
    SwUpdateMessageComponent,
    DatePickerDialogComponent,
    ItemDetailsComponent
  ]
})
export class CoreModule {}
