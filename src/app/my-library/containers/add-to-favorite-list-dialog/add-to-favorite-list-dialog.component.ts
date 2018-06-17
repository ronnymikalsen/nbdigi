import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as favoriteAction from './../../../+state/actions/favorite.actions';
import * as fromRoot from './../../../+state/reducers';
import { FavoriteList } from './../../../models/favorite-list';

@Component({
  selector: 'app-add-to-favorite-list-dialog',
  templateUrl: './add-to-favorite-list-dialog.component.html',
  styleUrls: ['./add-to-favorite-list-dialog.component.scss']
})
export class AddToFavoriteListDialogComponent implements OnInit {
  favoriteLists: Observable<FavoriteList[]> = this.store.select(
    fromRoot.getFavoriteList
  );

  showCreate = false;

  constructor(
    public dialogRef: MatDialogRef<AddToFavoriteListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {}

  toggleCreate() {
    this.showCreate = !this.showCreate;
  }

  addToList(list: FavoriteList) {
    this.dialogRef.close({
      id: list.id,
      name: list.name,
      items: [{ ...this.data.item }]
    });
  }

  addList(listName: string) {
    this.toggleCreate();
    this.store.dispatch(new favoriteAction.AddList(listName));
  }
}
