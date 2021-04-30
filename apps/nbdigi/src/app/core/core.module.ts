import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DatePickerDialogComponent } from '../search/containers/date-picker-dialog/date-picker-dialog.component';
import { ItemDetailsModule } from '../shared/item-details/item-details.module';
import { SharedModule } from '../shared/shared.module';
import { ItemDetailsComponent } from './../shared/item-details/item-details/item-details.component';
import { CustomHttp } from './custom-http';
import { DateAdapter as CustomDateAdapter } from './date-adapter';
import { AuthInterceptor } from './interceptors';
import { AuthService } from './services/auth.service';
import { CheckForUpdateService } from './services/check-for-update.service';
import { FavoriteService } from './services/favorite.service';
import { ItemDetailsService } from './services/item-details.service';
import { PresentationService } from './services/presentation.service';
import { SearchService } from './services/search.service';
import { SessionService } from './services/session.service';
import { TypeaheadService } from './services/typeahead.service';
import { ViewerService } from './services/viewer.service';
import { SwUpdateMessageComponent } from './sw-update-message/sw-update-message.component';

export function httpFactory(handler: HttpHandler) {
  return new CustomHttp(handler);
}

@NgModule({
  imports: [HttpClientModule, SharedModule, ItemDetailsModule],
  declarations: [SwUpdateMessageComponent, DatePickerDialogComponent],
  providers: [
    { provide: HttpClient, useFactory: httpFactory, deps: [HttpHandler] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'nb-NO' },
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
  ]
})
export class CoreModule {}
