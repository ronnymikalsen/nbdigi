import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: SettingsComponent }
    ])
  ],
  declarations: [SettingsComponent]
})
export class UiSettingsModule {}
