import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ClipboardModule } from 'ngx-clipboard';
import { MimeModule } from '@nationallibraryofnorway/ngx-mime';
import {
  MimeViewerIntl,
  MimeViewerIntlNoNb
} from '@nationallibraryofnorway/ngx-mime';

import { MaterialModule } from './material.module';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [DateFormatPipe],
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
    ClipboardModule,
    NgxChartsModule
  ],
  providers: [{ provide: MimeViewerIntl, useClass: MimeViewerIntlNoNb }]
})
export class SharedModule {}
