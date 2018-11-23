import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeStateModule } from '@nbdigi/home-state';

@NgModule({
  imports: [
    CommonModule,
    HomeStateModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: HomeComponent }
    ])
  ],
  declarations: [HomeComponent]
})
export class HomeViewModule {}
