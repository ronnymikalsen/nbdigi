import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-my-library></app-my-library>`
})
export class MyLibraryPageComponent {
  constructor() {}
}
