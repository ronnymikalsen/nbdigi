import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './containers/home-page';
import { HomeComponent } from './components/home/home.component';
import { ItemCardModule } from '../item-card/item-card.module';

@NgModule({
  imports: [SharedModule, HomeRoutingModule, ItemCardModule],
  declarations: [HomePageComponent, HomeComponent],
  providers: []
})
export class HomeModule {}
