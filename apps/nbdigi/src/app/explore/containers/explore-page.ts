import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchFacade } from '../../+state/search/search.facade';
import { Criteria, Genre } from '../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nbd-explore (genreChanged)="genreChanged($event)"></nbd-explore>
  `,
})
export class ExplorePageComponent {
  constructor(private searchFacade: SearchFacade) {}

  genreChanged(genre: Genre): void {
    if (genre) {
      this.searchFacade.setCriteria(
        new Criteria({
          genre: genre,
          mediaType: genre.mediaType,
        }),
      );
    }
    this.searchFacade.search();
  }
}
