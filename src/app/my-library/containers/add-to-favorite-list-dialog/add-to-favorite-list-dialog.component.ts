import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
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

  showCreate = false;

  constructor(
    public dialogRef: MatDialogRef<AddToFavoriteListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {}

  toggleCreate() {
    this.showCreate = !this.showCreate;
  }

  addToList(list: FavoriteList) {
    this.store.dispatch(
      new favoriteAction.AddToList({
        id: list.id,
        name: list.name,
        items: [{ ...this.data.item }]
      })
    );
    this.dialogRef.close();
  }

  addList(listName: string) {
    this.toggleCreate();
    this.store.dispatch(new favoriteAction.AddList(listName));
  }
}
