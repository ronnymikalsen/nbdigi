import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards';

@NgModule({
  imports: [CommonModule],
  providers: [AuthGuard]
})
export class BackendModule {}
