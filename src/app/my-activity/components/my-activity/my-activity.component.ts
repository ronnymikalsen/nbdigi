import { Component, Input, OnInit } from '@angular/core';

import { Criteria } from './../../../models/criteria';
import { Item } from './../../../models/search-result.model';

@Component({
  selector: 'app-my-activity',
  templateUrl: './my-activity.component.html',
  styleUrls: ['./my-activity.component.scss']
})
export class MyActivityComponent implements OnInit {
  @Input() items: Item[];
  @Input() criterias: Criteria;

  constructor() {}

  ngOnInit() {}
}
