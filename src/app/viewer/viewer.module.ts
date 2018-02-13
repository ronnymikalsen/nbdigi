import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerPageComponent } from './containers/viewer-page';
import { ViewerComponent } from './components/viewer/viewer.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ViewerPageComponent, ViewerComponent],
  entryComponents: [ViewerPageComponent]
})
export class ViewerModule { }
