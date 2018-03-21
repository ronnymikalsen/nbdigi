import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item, MediaTypeResults } from './../../../models/search-result.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() items: Item[];
  @Input() newBooks: MediaTypeResults;
  @Input() newPeriodicals: MediaTypeResults;
  @Input() newPhotos: MediaTypeResults;
  @Input() newNewspapers: MediaTypeResults;
  @Input() isDebugOn: boolean;
  @Output() searchSelected = new EventEmitter<void>();
  @Output() showMoreBooks = new EventEmitter<void>();
  @Output() showMorePeriodicals = new EventEmitter<void>();
  @Output() showMorePhotos = new EventEmitter<void>();
  @Output() showMoreNewspapers = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
