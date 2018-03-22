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

import { MediaTypeResults, Item } from './../../models/search-result.model';
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
  @Input() showToolbar = true;
  @Input() showIfEmpty = false;
  @Input() isDebugOn: boolean;
  @Input() rows = 2;
  @Output() mediaTypeChanged = new EventEmitter<MediaTypeResults>();
  size = 4;
  private watcher: Subscription;

  constructor(private media: ObservableMedia, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.watcher = this.media.subscribe((change: MediaChange) => {
      this.calculateAndUpdateSize();
    });
    this.calculateAndUpdateSize();
  }

  ngOnDestroy() {
    if (this.watcher) {
      this.watcher.unsubscribe();
    }
  }

  private calculateAndUpdateSize(): void {
    const sizeStrategy = SizeStrategyFactory.createStrategy(this.media);
    const newSize = sizeStrategy.getSize(this.rows);
    if (this.size !== newSize) {
      this.size = sizeStrategy.getSize(this.rows);
      this.cdr.markForCheck();
    }
  }
}
