import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '@nbdigi/data-models';

@Component({
  selector: 'nbd-ids-debug-dialog',
  templateUrl: './ids-debug-dialog.component.html',
  styleUrls: ['./ids-debug-dialog.component.scss']
})
export class IdsDebugDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IdsDebugDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item
  ) {}

  ngOnInit() {}
}
