import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MimeModule,
  MimeViewerIntl,
  MimeViewerIntlNoNb,
} from '@nationallibraryofnorway/ngx-mime';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent,
  NguTileComponent,
} from '@ngu/carousel';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ClipboardModule } from 'ngx-clipboard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ItemDetailsDrawerDirective } from './item-details-drawer.directive';
import { MaterialModule } from './material.module';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [DateFormatPipe, ItemDetailsDrawerDirective],
  imports: [
    MaterialModule,
    NgxChartsModule,
    NguCarousel,
    NguTileComponent,
    NguCarousel,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguItemComponent,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    InfiniteScrollModule,
    MimeModule,
    DateFormatPipe,
    ItemDetailsDrawerDirective,
    ClipboardModule,
    NgxChartsModule,
    LazyLoadImageModule,
    NguCarousel,
    NguTileComponent,
    NguCarousel,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguItemComponent,
  ],
  providers: [{ provide: MimeViewerIntl, useClass: MimeViewerIntlNoNb }],
})
export class SharedModule {}
