import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  MimeManifest,
  MimeViewerConfig
} from '@nationallibraryofnorway/ngx-mime';
import { Item } from '@nbdigi/data-models';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'nbd-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() item: Item;
  config = new MimeViewerConfig({
    attributionDialogHideTimeout: 3,
    navigationControlEnabled: false,
    preserveZoomOnCanvasGroupChange: true
  });
  @Output() change = new EventEmitter<Item>();
  private itemSubject: Subject<Item> = new Subject();

  constructor() {}

  ngOnInit() {
    this.onItemChange.subscribe((item: Item) => {
      this.change.emit(item);
    });
  }

  get onItemChange(): Observable<Item> {
    return this.itemSubject.asObservable().pipe(
      distinctUntilChanged(),
      debounceTime(2000)
    );
  }

  onManifestChange(manifest: MimeManifest) {
    this.itemSubject.next(this.item);
  }

  onCanvasChange(canvasId: number) {
    this.itemSubject.next({
      ...this.item,
      currentCanvasId: canvasId
    });
  }
}
