import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AppFacade } from './+state/app/app.facade';
import { CheckForUpdateService } from './core/services/check-for-update.service';
import { ItemDetailsService } from './core/services/item-details.service';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'nbd-root',
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
    private itemDetailsService: ItemDetailsService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private overlayContainer: OverlayContainer,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private appFacade: AppFacade
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
    appFacade.currentTheme$.subscribe(theme => {
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
    this.itemDetailsService.init();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
