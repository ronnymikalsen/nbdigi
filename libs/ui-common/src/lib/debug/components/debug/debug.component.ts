import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Item } from '@nbdigi/data-models';
import { IdsDebugDialogComponent } from '../ids-debug-dialog/ids-debug-dialog.component';

@Component({
  selector: 'nbd-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
  @Input() isDebugOn: boolean;
  @Input() href: string;
  @Input() item: Item;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openIds(event: MouseEvent) {
    const dialogRef = this.dialog.open(IdsDebugDialogComponent, {
      panelClass: 'debug-ids-panel',
      data: this.item
    });
  }
}