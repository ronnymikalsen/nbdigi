import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-explore></app-explore>`
})
export class ExplorePageComponent {
  constructor() {}
}
