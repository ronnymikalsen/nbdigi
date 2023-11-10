import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ExploreRoutingModule } from './explore-routing.module';
import { ExplorePageComponent } from './containers/explore-page';
import { ExploreComponent } from './components/explore/explore.component';

@NgModule({
  imports: [SharedModule, ExploreRoutingModule],
  declarations: [ExplorePageComponent, ExploreComponent],
  providers: [],
})
export class ExploreModule {}
