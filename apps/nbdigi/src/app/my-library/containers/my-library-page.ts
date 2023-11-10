import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <nbd-my-library></nbd-my-library> `,
})
export class MyLibraryPageComponent {
  constructor() {}
}
