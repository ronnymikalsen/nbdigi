import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
  @Input() isDebugOn: boolean;
  @Input() href: string;

  constructor() {}

  ngOnInit() {}
}
