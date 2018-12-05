import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MimeModule,
  MimeViewerIntl,
  MimeViewerIntlNoNb
} from '@nationallibraryofnorway/ngx-mime';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from 'ngx-clipboard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { ItemDetailsDrawerDirective } from './item-details-drawer.directive';
import { MaterialModule } from './material.module';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [DateFormatPipe, ItemDetailsDrawerDirective],
  imports: [MaterialModule, LazyLoadImagesModule, NgxChartsModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    LazyLoadImagesModule,
    InfiniteScrollModule,
    MimeModule,
    DateFormatPipe,
    ItemDetailsDrawerDirective,
    ClipboardModule,
    NgxChartsModule
  ],
  providers: [{ provide: MimeViewerIntl, useClass: MimeViewerIntlNoNb }]
})
export class SharedModule {}
