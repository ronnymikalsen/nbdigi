import { NgModule } from '@angular/core';
import {
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
  MatProgressBarModule
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
    MatProgressBarModule
  ]
})
export class MaterialModule {}
