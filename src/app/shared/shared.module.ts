import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

import { MaterialModule } from './material.module';

@NgModule({
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    LazyLoadImagesModule
  ]
})
export class SharedModule {}
