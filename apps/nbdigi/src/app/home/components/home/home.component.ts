import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Item, MediaTypeResults } from '@nbdigi/data-models';

@Component({
  selector: 'nbd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() items: Item[];
  @Input() newBooks: MediaTypeResults;
  @Input() newPeriodicals: MediaTypeResults;
  @Input() newPhotos: MediaTypeResults;
  @Input() newNewspapers: MediaTypeResults;
  @Input() newOthers: MediaTypeResults;
  @Input() showItemDetails: boolean;
  @Input() isDebugOn: boolean;
  @Output() searchSelected = new EventEmitter<void>();
  @Output() showMoreBooks = new EventEmitter<void>();
  @Output() showMorePeriodicals = new EventEmitter<void>();
  @Output() showMorePhotos = new EventEmitter<void>();
  @Output() showMoreNewspapers = new EventEmitter<void>();

  constructor(public media: ObservableMedia) {}

  ngOnInit() {}
}
