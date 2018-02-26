import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../../+state/reducers';
import * as fromSession from './../../../+state/reducers/session.reducer';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() session: fromSession.State;

  @Output() signOut = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
