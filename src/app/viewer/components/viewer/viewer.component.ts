import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../../models/search-result.model';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() item: Item;
  manifestUri = 'https://api.nb.no/catalog/v1/iiif/4373a97010f9a6b0908cd16c7e495f7d/manifest';

  constructor() { }

  ngOnInit() {
  }

}
