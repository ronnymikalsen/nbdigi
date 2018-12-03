import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { User } from '../../../core/models';

@Component({
  selector: 'nbd-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() user: User;
  @Input() currentTheme: string;

  @Output() signOut = new EventEmitter<void>();
  @Output() themeChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  theme(change: MatSlideToggleChange) {
    const selectedTheme = change.checked ? 'dark-theme' : 'default-theme';
    this.themeChange.emit(selectedTheme);
  }
}
