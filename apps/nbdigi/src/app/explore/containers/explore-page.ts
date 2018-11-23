import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as searchAction from '../../+state/actions/search.actions';
import * as fromRoot from '../../+state/reducers';
import { Genre } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-explore (genreChanged)="genreChanged($event)"></nbd-explore>
  `
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
