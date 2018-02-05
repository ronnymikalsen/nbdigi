import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyLibraryPageComponent } from './containers/my-library-page';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: MyLibraryPageComponent }])],
  exports: [RouterModule]
})
export class MyLibraryRoutingModule {}
