import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'nbd-rename-favorite-dialog',
  templateUrl: './rename-favorite-dialog.component.html',
  styleUrls: ['./rename-favorite-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameFavoriteDialogComponent implements OnInit {
  listForm!: FormGroup;
  listName!: FormControl;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RenameFavoriteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.listName = new FormControl();
    this.listForm = this.fb.group({
      listName: this.listName,
    });

    this.listName.patchValue(this.data.name);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  renameList(event: any) {
    this.dialogRef.close({
      favoriteList: this.data,
      newName: this.listName.value,
    });
  }
}
