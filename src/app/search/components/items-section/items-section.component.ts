import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';

import { MediaTypeResults, Item } from './../../../models/search-result.model';
import { SizeStrategyFactory } from './size-strategy.factory';

@Component({
  selector: 'app-items-section',
  templateUrl: './items-section.component.html',
  styleUrls: ['./items-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsSectionComponent implements OnInit, OnDestroy {
  @Input() mediaTypeResults = new MediaTypeResults();
  @Output() itemSelected = new EventEmitter<Item>();
  size = 4;
  private watcher: Subscription;

  constructor(private media: ObservableMedia, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.watcher = this.media.subscribe((change: MediaChange) => {
      const sizeStrategy = SizeStrategyFactory.createStrategy(change.mqAlias);
      const newSize = sizeStrategy.getSize();
      if (this.size !== newSize) {
        this.size = sizeStrategy.getSize();
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
}
