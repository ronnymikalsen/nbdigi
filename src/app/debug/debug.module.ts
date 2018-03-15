import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { DebugComponent } from './components/debug/debug.component';

@NgModule({
  imports: [SharedModule],
  declarations: [DebugComponent],
  exports: [DebugComponent]
})
export class DebugModule {}
