import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ViewerModule } from './viewer/viewer.module';

@NgModule({
  imports: [CommonModule],
  exports: [ViewerModule]
})
export class UiCommonModule {}
