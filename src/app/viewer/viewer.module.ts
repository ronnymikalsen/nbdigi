import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerPageComponent } from './containers/viewer-page';
import { ViewerComponent } from './components/viewer/viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ViewerPageComponent, ViewerComponent],
  entryComponents: [ViewerPageComponent]
})
export class ViewerModule { }
