import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRoot from '../../../+state/reducers';
import * as fromSession from '../../../+state/reducers/session.reducer';
import { MatSlideToggleChange } from '@angular/material';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() session: fromSession.State;

  @Output() signOut = new EventEmitter<void>();
  @Output() themeChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  theme(change: MatSlideToggleChange) {
    const selectedTheme = change.checked ? 'dark-theme' : 'default-theme';
    this.themeChange.emit(selectedTheme);
  }
}
