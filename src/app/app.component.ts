import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromRoot from './+state/reducers';
import { CheckForUpdateService } from './core/check-for-update-service/check-for-update.service';
import { SessionService } from './core/session-service/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  currentTheme: string;
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
    private updates: CheckForUpdateService,
    private sessionService: SessionService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private store: Store<fromRoot.State>,
    private overlayContainer: OverlayContainer,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    iconRegistry.addSvgIcon(
      'logo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/logo.svg')
    );
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/google-logo.svg')
    );
    this.mobileQuery = media.matchMedia('screen and (max-width: 1279px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.store.select(fromRoot.currentTheme).subscribe(theme => {
      const previousTheme = this.currentTheme;
      this.currentTheme = theme;
      this.overlayContainer
        .getContainerElement()
        .classList.remove(previousTheme);
      this.overlayContainer
        .getContainerElement()
        .classList.add(this.currentTheme);
    });
  }

  ngOnInit() {
    this.updates.init();
    this.sessionService.init();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
