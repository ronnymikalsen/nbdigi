import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSelectModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatCheckboxModule
  ]
})
export class UiMaterialModule {}
