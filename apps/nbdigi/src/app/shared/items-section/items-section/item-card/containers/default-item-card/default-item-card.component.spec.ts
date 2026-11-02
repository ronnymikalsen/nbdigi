import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { of } from 'rxjs';
import { AppFacade } from '../../../../../../+state/app/app.facade';
import { ItemFacade } from '../../../../../../+state/item/item.facade';
import { Item } from '../../../../../../core/models';
import { MaterialModule } from '../../../../../material.module';
import { DateFormatPipe } from '../../../../../pipes/date-format.pipe';
import { DefaultItemCardComponent } from './default-item-card.component';

describe('DefaultItemCardComponent', () => {
  let fixture: ComponentFixture<DefaultItemCardComponent>;
  let open: jest.Mock;

  beforeEach(async () => {
    open = jest.fn();
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MaterialModule,
        NoopAnimationsModule,
        LazyLoadImageModule,
      ],
      declarations: [DefaultItemCardComponent, DateFormatPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AppFacade, useValue: { isDebugOn$: of(false) } },
        { provide: ItemFacade, useValue: { open } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DefaultItemCardComponent);
    fixture.componentRef.setInput(
      'item',
      new Item({ id: 'dog', title: 'Hund', creator: 'Wilse' }),
    );
    fixture.detectChanges();
  });

  it('keeps existing cards at their normal size by default', () => {
    expect(fixture.nativeElement.querySelector('mat-card.compact')).toBeNull();
    expect(fixture.nativeElement.querySelector('.title').textContent).toContain(
      'Hund',
    );
  });

  it('keeps the title and creator visible in a compact gallery card', () => {
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('mat-card.compact'),
    ).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.title').textContent).toContain(
      'Hund',
    );
    expect(
      fixture.nativeElement.querySelector('.creator').textContent,
    ).toContain('Wilse');
  });

  it('opens the selected item from a compact gallery', () => {
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.thumbnail').click();
    expect(open).toHaveBeenCalledWith(fixture.componentInstance.item);
  });
});
