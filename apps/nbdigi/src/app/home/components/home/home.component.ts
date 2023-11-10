import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MediaTypeResults } from '../../../core/models';

@Component({
  selector: 'nbd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input() items!: MediaTypeResults | null;
  @Input() newBooks!: MediaTypeResults | null;
  @Input() newPeriodicals!: MediaTypeResults | null;
  @Input() newPhotos!: MediaTypeResults | null;
  @Input() newNewspapers!: MediaTypeResults | null;
  @Input() newOthers!: MediaTypeResults | null;
  @Input() showItemDetails!: boolean | null;
  @Input() isDebugOn!: boolean | null;
  @Output() searchSelected = new EventEmitter<string>();
  @Output() showMoreBooks = new EventEmitter<void>();
  @Output() showMorePeriodicals = new EventEmitter<void>();
  @Output() showMorePhotos = new EventEmitter<void>();
  @Output() showMoreNewspapers = new EventEmitter<void>();

  constructor(public media: MediaObserver) {}

  ngOnInit() {}
}
