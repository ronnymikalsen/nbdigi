import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  NguCarousel,
  NguTileComponent,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
} from '@ngu/carousel';
import { Item, MediaTypeResults } from '../../../core/models';
import { MaterialModule } from '../../material.module';
import { ItemsSectionComponent } from './items-section.component';

describe('ItemsSectionComponent carousel', () => {
  let fixture: ComponentFixture<ItemsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        NoopAnimationsModule,
        NguCarousel,
        NguTileComponent,
        NguCarouselDefDirective,
        NguCarouselNextDirective,
        NguCarouselPrevDirective,
      ],
      declarations: [ItemsSectionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ItemsSectionComponent);
    fixture.componentRef.setInput('label', 'Bilder');
    fixture.componentRef.setInput('showToolbar', false);
    fixture.componentRef.setInput('compactCards', true);
    fixture.componentRef.setInput('list', null);
  });

  it('passes every loaded card to the existing carousel and keeps compact cards', async () => {
    const items = Array.from(
      { length: 20 },
      (_, i) => new Item({ id: `photo-${i}` }),
    );
    fixture.componentRef.setInput(
      'mediaTypeResults',
      new MediaTypeResults({ mediaType: 'bilder', totalElements: 83, items }),
    );
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const carousel = fixture.debugElement.query(
      By.directive(NguCarousel),
    ).componentInstance;
    expect(carousel.dataSource()).toEqual(items);
    const cards = fixture.nativeElement.querySelectorAll(
      'nbd-default-item-card',
    );
    expect(cards).toHaveLength(20);
    expect(cards[19].item.id).toBe('photo-19');
    expect(cards[19].compact).toBe(true);
    expect(fixture.nativeElement.querySelector('mat-toolbar')).toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        'button[aria-label="Neste treff: Bilder"]',
      ),
    ).not.toBeNull();
  });
});
