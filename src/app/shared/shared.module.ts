import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { MimeModule } from '@nationallibraryofnorway/ngx-mime';
import { MimeViewerIntl, MimeViewerIntlNoNb } from '@nationallibraryofnorway/ngx-mime';

import { MaterialModule } from './material.module';

@NgModule({
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    LazyLoadImagesModule,
    MimeModule
  ],
  providers: [ { provide: MimeViewerIntl, useClass: MimeViewerIntlNoNb } ],
})
export class SharedModule {}
