import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { DebugComponent } from './components/debug/debug.component';
import { IdsDebugDialogComponent } from './components/ids-debug-dialog/ids-debug-dialog.component';
import { IdCopyValueComponent } from './components/id-copy-value/id-copy-value.component';

@NgModule({
  imports: [SharedModule],
  declarations: [DebugComponent, IdsDebugDialogComponent, IdCopyValueComponent],
  entryComponents: [IdsDebugDialogComponent],
  exports: [DebugComponent]
})
export class DebugModule {}
