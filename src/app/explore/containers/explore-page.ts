import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Genre } from '../../models/genre-options.model';
import * as searchAction from '../../+state/actions/search.actions';
import * as fromRoot from '../../+state/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-explore (genreChanged)="genreChanged($event)"></app-explore>`
})
export class ExplorePageComponent {
  constructor(private store: Store<fromRoot.State>) {}

  genreChanged(genre: Genre): void {
    if (genre) {
      this.store.dispatch(
        new searchAction.SetCriteria({
          genre: genre,
          mediaType: genre.mediaType
        })
      );
    }
    this.store.dispatch(new searchAction.Search());
  }
}
