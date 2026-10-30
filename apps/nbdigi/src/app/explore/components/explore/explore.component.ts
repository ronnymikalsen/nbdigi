import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Genre, GenreOptions } from '../../../core/models';

@Component({
  selector: 'nbd-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ExploreComponent implements OnInit {
  @Output() genreChanged = new EventEmitter<Genre>();
  genreOptions = new GenreOptions().all;
  constructor() {}

  ngOnInit() {}
}
