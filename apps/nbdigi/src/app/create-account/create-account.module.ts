import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CreateAccountRoutingModule } from './create-account-routing.module';
import { CreateAccountPageComponent } from './containers/create-account-page';
import { CreateAccountComponent } from './components/create-account/create-account.component';

@NgModule({
  imports: [SharedModule, CreateAccountRoutingModule],
  declarations: [CreateAccountPageComponent, CreateAccountComponent],
  providers: []
})
export class CreateAccountModule {}
