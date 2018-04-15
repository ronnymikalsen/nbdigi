import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromRoot from './../../../+state/reducers';
import * as favoriteAction from './../../../+state/actions/favorite.actions';

@Component({
  selector: 'app-add-to-favorite-list-dialog',
  templateUrl: './add-to-favorite-list-dialog.component.html',
  styleUrls: ['./add-to-favorite-list-dialog.component.scss']
})
export class AddToFavoriteListDialogComponent implements OnInit {
  showCreate: false;
  listForm: FormGroup;
  listName: FormControl;

  constructor(private fb: FormBuilder, private store: Store<fromRoot.State>) {
    this.createForm();
  }

  ngOnInit() {
    this.store.dispatch(new favoriteAction.FetchLists());
  }

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
}
