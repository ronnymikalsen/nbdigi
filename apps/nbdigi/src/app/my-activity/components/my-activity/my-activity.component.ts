import { Component, Input, OnInit } from '@angular/core';
import { Criteria, Item } from '../../../core/models';

@Component({
  selector: 'nbd-my-activity',
  templateUrl: './my-activity.component.html',
  styleUrls: ['./my-activity.component.scss']
})
export class MyActivityComponent implements OnInit {
  @Input() items: Item[];
  @Input() criterias: Criteria;

  constructor() {}

  ngOnInit() {}
}
