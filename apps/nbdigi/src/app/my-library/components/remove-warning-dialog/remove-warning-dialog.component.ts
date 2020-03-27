import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'nbd-remove-warning-dialog',
  templateUrl: './remove-warning-dialog.component.html',
  styleUrls: ['./remove-warning-dialog.component.scss']
})
export class RemoveWarningDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RemoveWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
