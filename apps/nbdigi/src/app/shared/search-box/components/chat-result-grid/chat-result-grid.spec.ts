import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../../../../core/models';
import { ChatResultGrid } from './chat-result-grid';

jest.mock(
  '../../../items-section/items-section/item-card/item-card.module',
  () => ({ ItemCardModule: class {} }),
);

describe('ChatResultGrid', () => {
  let fixture: ComponentFixture<ChatResultGrid>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ChatResultGrid] })
      .overrideComponent(ChatResultGrid, {
        set: { imports: [MatButtonModule], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(ChatResultGrid);
    fixture.componentRef.setInput('label', 'Bilder');
    fixture.componentRef.setInput(
      'items',
      Array.from({ length: 40 }, (_, i) => new Item({ id: `photo-${i}` })),
    );
    fixture.detectChanges();
  });

  it('shows all forty requested results with no expansion control', () => {
    expect(
      fixture.nativeElement.querySelectorAll('nbd-default-item-card'),
    ).toHaveLength(40);
    expect(
      fixture.nativeElement.querySelector('button[aria-expanded]'),
    ).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Vis resten');
  });

  it('requests the next page on click and disables the button while pending', () => {
    const more = jest.fn();
    fixture.componentInstance.moreRequested.subscribe(more);
    fixture.componentRef.setInput('canLoadMore', true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.more-results').click();
    expect(more).toHaveBeenCalledWith('Vis flere bilder');
    expect(
      fixture.nativeElement.querySelectorAll('nbd-default-item-card'),
    ).toHaveLength(40);
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.more-results').disabled).toBe(
      true,
    );
    fixture.nativeElement.querySelector('.more-results').click();
    expect(more).toHaveBeenCalledTimes(1);
  });

  it('omits the next-search button when there is no next page', () => {
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
