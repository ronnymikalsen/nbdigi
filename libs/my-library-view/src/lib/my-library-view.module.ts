import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyLibraryComponent } from './my-library/my-library.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: MyLibraryComponent }
    ])
  ],
  declarations: [MyLibraryComponent]
})
export class MyLibraryViewModule {}
