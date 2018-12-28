import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { Subscription } from 'rxjs';
import { FavoriteList, MediaTypeResults } from '../../../core/models';

@Component({
  selector: 'nbd-items-section',
  templateUrl: './items-section.component.html',
  styleUrls: ['./items-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsSectionComponent implements OnChanges, OnDestroy {
  @Input() mediaTypeResults = new MediaTypeResults();
  @Input() selected = false;
  @Input() label: string;
  @Input() showMoreButton = false;
  @Input() showToolbar = true;
  @Input() showIfEmpty = false;
  @Input() isDebugOn: boolean;
  @Output() mediaTypeChanged = new EventEmitter<MediaTypeResults>();
  @Input() list: FavoriteList;
  @Input() asList: boolean;
  private watcher: Subscription;

  carouselItems: Array<any> = [];
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 3, sm: 5, md: 5, lg: 8, all: 0 },
    point: {
      visible: true
    },
    touch: true
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy() {
    if (this.watcher) {
      this.watcher.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mediaTypeResults']) {
      this.carouselItems = [];
      if (this.mediaTypeResults) {
        for (let i = 0; i < this.mediaTypeResults.items.length; i++) {
          const el = this.mediaTypeResults.items[i];
          this.carouselItems.push(el);
        }
      }
      setTimeout(() => {
        this.cdr.markForCheck();
      }, 1);
    }
  }
}
