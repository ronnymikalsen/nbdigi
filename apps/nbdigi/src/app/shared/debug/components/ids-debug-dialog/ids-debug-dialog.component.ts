import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../../../../core/models';

@Component({
  selector: 'nbd-ids-debug-dialog',
  templateUrl: './ids-debug-dialog.component.html',
  styleUrls: ['./ids-debug-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IdsDebugDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IdsDebugDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item,
  ) {}

  ngOnInit() {}
}
