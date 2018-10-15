import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as fromRoot from '../+state/reducers';

@Directive({
  selector: '[appItemDetailsDrawer]'
})
export class ItemDetailsDrawerDirective implements OnInit, OnDestroy {
  @HostBinding('style.width') width = '375px';
  currentFixTop: boolean;
  showItemDetails: boolean;
  private destroyed: Subject<void> = new Subject();

  constructor(
    private media: ObservableMedia,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    public renderer: Renderer2,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store.select(fromRoot.showItemDetails).subscribe(value => {
      this.showItemDetails = value;
      this.updatePosition();
    });

    const mainEl = document.querySelector('.main-content');
    mainEl.addEventListener('scroll', () => {
      this.updatePosition();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private updatePosition() {
    const drawerEl = document.querySelector('.drawer-container');
    const top = drawerEl.getBoundingClientRect().top;
    const prevFixTop = this.currentFixTop;
    const newFixTop =
      this.showItemDetails && this.media.isActive('gt-sm') && top < 0
        ? (this.currentFixTop = true)
        : (this.currentFixTop = false);

    if (prevFixTop !== newFixTop) {
      this.currentFixTop = newFixTop;
      if (this.currentFixTop) {
        this.renderer.removeClass(this.elementRef.nativeElement, 'not-sticky');
        this.renderer.addClass(this.elementRef.nativeElement, 'fix-sticky');
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'position',
          'sticky'
        );
        this.renderer.setStyle(this.elementRef.nativeElement, 'float', 'right');
        this.renderer.setStyle(this.elementRef.nativeElement, 'width', 'width');
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'height',
          'calc(100vh - 5px)'
        );
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'overflow-x',
          'hidden'
        );
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'overflow-y',
          'visible'
        );
      } else {
        this.renderer.addClass(this.elementRef.nativeElement, 'not-sticky');
        this.renderer.removeClass(this.elementRef.nativeElement, 'fix-sticky');
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'position',
          'absolute'
        );
      }
      this.cdr.markForCheck();
    }
  }
}
