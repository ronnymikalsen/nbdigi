import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'nbd-sw-update-message',
  templateUrl: './sw-update-message.component.html',
  styleUrls: ['./sw-update-message.component.scss']
})
export class SwUpdateMessageComponent implements OnInit {
  private action: Subject<string> = new Subject<string>();
  constructor(updates: SwUpdate) {}

  get onAction(): Observable<string> {
    return this.action.asObservable();
  }

  ngOnInit() {}

  update() {
    this.action.next('UPDATE');
  }

  cancel() {
    this.action.next('CANCEL');
  }
}
