import { MyLibraryPageComponent } from './containers/my-library-page';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { MyLibraryComponent } from './components/my-library/my-library.component';

@NgModule({
  imports: [SharedModule, MyLibraryRoutingModule],
  declarations: [MyLibraryPageComponent, MyLibraryComponent],
  providers: []
})
export class MyLibraryModule {}
