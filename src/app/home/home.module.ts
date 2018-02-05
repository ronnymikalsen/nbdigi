import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './containers/home-page';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [HomePageComponent, HomeComponent],
  providers: []
})
export class HomeModule {}
