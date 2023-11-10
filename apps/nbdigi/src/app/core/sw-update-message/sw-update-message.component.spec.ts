import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';

import { SwUpdateMessageComponent } from './sw-update-message.component';

describe('SwUpdateMessageComponent', () => {
  let component: SwUpdateMessageComponent;
  let fixture: ComponentFixture<SwUpdateMessageComponent>;
  const swUpdateSpy = jasmine.createSpy('SwUpdate');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SwUpdateMessageComponent],
      providers: [{ provide: SwUpdate, useValue: swUpdateSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwUpdateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
