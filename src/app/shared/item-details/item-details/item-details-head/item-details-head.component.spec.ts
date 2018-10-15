import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestItems } from '../../../../item/metadata/shared/item.mock';
import { MediaType } from '../../../mediatype/mediatype-utils';
import { SharedModule } from '../../../shared.module';
import { ItemDetailsHeadComponent } from './item-details-head.component';

describe('ItemDetailsHeadComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [ItemDetailsHeadComponent, TestHostComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(TestHostComponent).toBeTruthy();
  });

  describe('Newspapers', () => {
    it('should format issued date ', () => {
      const newspaper = {
        ...TestItems.aDefaultItem(),
        mediaType: MediaType.NEWSPAPER,
        issuedDate: '20010101'
      };
      testHost.item = newspaper;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.issuedDate')).nativeElement
          .textContent
      ).toEqual('01.01.2001');
    });
  });

  describe('Default', () => {
    it('should not format issued date', () => {
      const book = {
        ...TestItems.aDefaultItem(),
        mediaType: MediaType.BOOK,
        issuedDate: 'summer of 69'
      };
      testHost.item = book;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.issuedDate')).nativeElement
          .textContent
      ).toEqual('summer of 69');
    });
  });
});

@Component({
  template: `
    <nb-item-details-head [item]="item"></nb-item-details-head>
  `
})
class TestHostComponent {
  item = TestItems.aDefaultItem();
}
