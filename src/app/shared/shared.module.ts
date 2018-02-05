import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, MaterialModule],
  exports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, MaterialModule]
})
export class SharedModule {}
