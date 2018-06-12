import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-remove-favorite-dialog',
  templateUrl: './remove-favorite-dialog.component.html',
  styleUrls: ['./remove-favorite-dialog.component.scss']
})
export class RemoveFavoriteDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RemoveFavoriteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
