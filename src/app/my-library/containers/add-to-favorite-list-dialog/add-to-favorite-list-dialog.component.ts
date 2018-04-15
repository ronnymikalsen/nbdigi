import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import * as favoriteAction from './../../../+state/actions/favorite.actions';
import * as fromRoot from './../../../+state/reducers';
import { FavoriteList } from './../../../models/favorite-list';
import { Item } from '../../../models/search-result.model';

@Component({
  selector: 'app-add-to-favorite-list-dialog',
  templateUrl: './add-to-favorite-list-dialog.component.html',
  styleUrls: ['./add-to-favorite-list-dialog.component.scss']
})
export class AddToFavoriteListDialogComponent implements OnInit {
  favoriteLists: Observable<FavoriteList[]> = this.store.select(
    fromRoot.getFavoriteList
  );

  showCreate: false;
  listForm: FormGroup;
  listName: FormControl;

  constructor(
    public dialogRef: MatDialogRef<AddToFavoriteListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.listName = new FormControl();
    this.listForm = this.fb.group({
      listName: this.listName
    });
  }

  cancle() {
    this.showCreate = false;
    this.listName.reset();
  }

  addList(event: MouseEvent) {
    event.preventDefault();
    this.showCreate = false;
    this.store.dispatch(new favoriteAction.AddList(this.listName.value));
  }

  addToList(name: string) {
    this.store.dispatch(
      new favoriteAction.AddToList({
        name: name,
        items: [{ ...this.data.item }]
      })
    );
    this.dialogRef.close();
    this.snackBar.open('Lagt til i din liste', null, {
      duration: 3000
    });
  }
}
