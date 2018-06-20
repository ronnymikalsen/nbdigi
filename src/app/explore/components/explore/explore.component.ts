import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Genre, GenreOptions } from '../../../models/genre-options.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  @Output() genreChanged = new EventEmitter<Genre>();
  genreOptions = new GenreOptions().all;
  constructor() {}

  ngOnInit() {}
}
