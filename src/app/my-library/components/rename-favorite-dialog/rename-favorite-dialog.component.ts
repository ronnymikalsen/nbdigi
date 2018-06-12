import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromRoot from './../../../+state/reducers';
import * as favoriteActions from './../../../+state/actions/favorite.actions';
import { FavoriteList } from '../../../models/favorite-list';

@Component({
  selector: 'app-rename-favorite-dialog',
  templateUrl: './rename-favorite-dialog.component.html',
  styleUrls: ['./rename-favorite-dialog.component.scss']
})
export class RenameFavoriteDialogComponent implements OnInit {
  listForm: FormGroup;
  listName: FormControl;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RenameFavoriteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.listName = new FormControl();
    this.listForm = this.fb.group({
      listName: this.listName
    });

    this.listName.patchValue(this.data.name);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  renameList(event: any) {
    this.dialogRef.close({
      favoriteList: this.data,
      newName: this.listName.value
    });
  }
}
