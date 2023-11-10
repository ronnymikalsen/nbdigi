import { NgModule } from '@angular/core';

import { SettingsComponent } from './components/settings/settings.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPageComponent } from './containers/settings-page';

@NgModule({
  imports: [SharedModule, SettingsRoutingModule],
  declarations: [SettingsComponent, SettingsPageComponent],
})
export class SettingsModule {}
