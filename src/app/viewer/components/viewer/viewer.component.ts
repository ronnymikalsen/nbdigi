import { Component, OnInit, Input } from '@angular/core';
import { MimeViewerConfig } from '@nationallibraryofnorway/ngx-mime';

import { Item } from '../../../models/search-result.model';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() item: Item;
  config = new MimeViewerConfig({});

  constructor() {}

  ngOnInit() {}
}
