import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  MimeViewerConfig,
  MimeManifest
} from '@nationallibraryofnorway/ngx-mime';
import { Subject } from 'rxjs/Subject';

import { Item } from '../../../models/search-result.model';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, debounce, debounceTime } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() item: Item;
  config = new MimeViewerConfig({
    attributionDialogHideTimeout: 3,
    navigationControlEnabled: false
  });
  @Output() change = new EventEmitter<Item>();
  @Output() addToFavorites = new EventEmitter<Item>();
  private itemSubject: Subject<Item> = new Subject();

  constructor() {}

  ngOnInit() {
    this.onItemChange.subscribe((item: Item) => {
      this.change.emit(item);
    });
  }

  get onItemChange(): Observable<Item> {
    return this.itemSubject
      .asObservable()
      .pipe(distinctUntilChanged(), debounceTime(2000));
  }

  onManifestChange(manifest: MimeManifest) {
    this.itemSubject.next(this.item);
  }

  onPageChange(canvasId: number) {
    this.itemSubject.next({
      ...this.item,
      currentCanvasId: canvasId
    });
  }
}
