import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'nbd-search-activity',
  templateUrl: './search-activity.component.html',
  styleUrls: ['./search-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchActivityComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
