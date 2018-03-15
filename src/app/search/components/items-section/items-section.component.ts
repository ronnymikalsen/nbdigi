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
  @Input() selected = false;
  @Input() label: string;
  @Input() showMoreButton = false;
  @Input() isDebugOn: boolean;
  @Output() mediaTypeChanged = new EventEmitter<MediaTypeResults>();
  size = 4;
  private watcher: Subscription;

  constructor(private media: ObservableMedia, private cdr: ChangeDetectorRef) {
    this.watcher = this.media.subscribe((change: MediaChange) => {
      this.calculateAndUpdateSize();
    });
    this.calculateAndUpdateSize();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  private calculateAndUpdateSize(): void {
    const sizeStrategy = SizeStrategyFactory.createStrategy(this.media);
    const newSize = sizeStrategy.getSize();
    if (this.size !== newSize) {
      this.size = sizeStrategy.getSize();
      this.cdr.markForCheck();
    }
  }
}
