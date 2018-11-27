import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import { FavoriteList } from '../../../core/models';

@Component({
  selector: 'nbd-add-to-favorite-list-dialog',
  templateUrl: './add-to-favorite-list-dialog.component.html',
  styleUrls: ['./add-to-favorite-list-dialog.component.scss']
})
export class AddToFavoriteListDialogComponent implements OnInit {
  favoriteLists: Observable<FavoriteList[]> = this.favoriteFacade
    .getFavoriteList$;

  showCreate = false;

  constructor(
    public dialogRef: MatDialogRef<AddToFavoriteListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private favoriteFacade: FavoriteFacade
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
    this.favoriteFacade.addList(listName);
  }
}
