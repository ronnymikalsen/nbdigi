import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item } from './../../../models/search-result.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() items: Item[];
  @Output() searchSelected = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
