import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultItemListComponent } from './default-item-list.component';

describe('DefaultItemListComponent', () => {
  let component: DefaultItemListComponent;
  let fixture: ComponentFixture<DefaultItemListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DefaultItemListComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
