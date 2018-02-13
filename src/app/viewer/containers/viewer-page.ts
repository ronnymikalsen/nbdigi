import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-viewer></app-viewer>`
})
export class ViewerPageComponent {
  constructor() {}
}
