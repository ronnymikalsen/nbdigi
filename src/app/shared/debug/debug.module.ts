import { NgModule } from '@angular/core';
import { SharedModule } from './../shared.module';
import { DebugComponent } from './components/debug/debug.component';
import { IdCopyValueComponent } from './components/id-copy-value/id-copy-value.component';
import { IdsDebugDialogComponent } from './components/ids-debug-dialog/ids-debug-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [DebugComponent, IdsDebugDialogComponent, IdCopyValueComponent],
  entryComponents: [IdsDebugDialogComponent],
  exports: [DebugComponent]
})
export class DebugModule {}
