import { Component, OnInit, Input } from '@angular/core';
import { MediaTypeResults } from '../../../models/search-result.model';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss']
})
export class FavoriteListComponent implements OnInit {
  @Input() items: MediaTypeResults;
  @Input() isDebugOn: boolean;

  constructor() {}

  ngOnInit() {}
}
