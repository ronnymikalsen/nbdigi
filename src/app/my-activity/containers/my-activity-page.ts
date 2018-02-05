import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-my-activity></app-my-activity>`
})
export class MyActivityPageComponent {
  constructor() {}
}
