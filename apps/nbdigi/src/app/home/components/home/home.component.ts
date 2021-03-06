import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MediaTypeResults } from '../../../core/models';

@Component({
  selector: 'nbd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() items: MediaTypeResults;
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

  constructor(public media: MediaObserver) {}

  ngOnInit() {}
}
