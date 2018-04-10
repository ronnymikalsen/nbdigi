import { CriteriaListComponent } from './containers/criteria-list/criteria-list.component';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [CriteriaListComponent],
  exports: [CriteriaListComponent]
})
export class CriteriaListItemModule {}
