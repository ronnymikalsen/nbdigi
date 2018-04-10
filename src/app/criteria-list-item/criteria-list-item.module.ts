import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { CriteriaListItemComponent } from './components/criteria-list-item/criteria-list-item.component';
import { CriteriaListComponent } from './containers/criteria-list/criteria-list.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CriteriaListComponent, CriteriaListItemComponent],
  exports: [CriteriaListComponent]
})
export class CriteriaListItemModule {}
