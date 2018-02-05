import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-home></app-home>`
})
export class HomePageComponent {
  constructor() {}
}
