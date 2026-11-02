import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

import { SearchBoxComponent } from './search-box.component';
import { Criteria, DateOption, Hint } from '../../../../core/models';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        StoreModule.forRoot({}),
      ],
      declarations: [SearchBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits a chat message without sending it as a raw catalogue query', () => {
    const chat = jest.spyOn(component.chatSubmitted, 'emit');
    const search = jest.spyOn(component.searchSelected, 'emit');
    component.queryControl.setValue('Vis bilder av hunder');
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(chat).toHaveBeenCalledWith('Vis bilder av hunder');
    expect(search).not.toHaveBeenCalled();
    expect(component.queryControl.value).toBe('');
  });

  it('keeps the follow-up draft when search criteria change', () => {
    component.queryControl.setValue('Bare etter 2000');
    fixture.componentRef.setInput('q', 'hunder');
    fixture.detectChanges();
    expect(component.queryControl.value).toBe('Bare etter 2000');
  });

  it('retains ordinary search and restores the active query when switching modes', () => {
    const search = jest.spyOn(component.searchSelected, 'emit');
    fixture.componentRef.setInput('q', 'hunder');
    fixture.detectChanges();
    component.setChatMode(false);
    expect(component.queryControl.value).toBe('hunder');
    component.onSubmit();
    expect(search).toHaveBeenCalledWith('hunder');
  });

  it('prevents duplicate messages while waiting for AI', () => {
    const chat = jest.spyOn(component.chatSubmitted, 'emit');
    component.pending = true;
    component.queryControl.setValue('Bare etter 2000');
    component.onSubmit();
    expect(chat).not.toHaveBeenCalled();
    expect(component.queryControl.value).toBe('Bare etter 2000');
  });

  it('shows the conversation and active search as text', () => {
    fixture.componentRef.setInput('messages', [
      { role: 'user', text: '<img src=x onerror=alert(1)>' },
    ]);
    fixture.componentRef.setInput(
      'activeCriteria',
      new Criteria({ q: 'hunder', mediaType: 'bilder' }),
    );
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="log"]').textContent,
    ).toContain('<img src=x');
    expect(fixture.nativeElement.querySelector('[role="log"] img')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.active-search').textContent,
    ).toContain('hunder');
  });

  it('removes only the selected place chip', () => {
    const removed = jest.spyOn(component.filterRemoved, 'emit');
    fixture.componentRef.setInput(
      'activeCriteria',
      new Criteria({
        q: 'hunder',
        mediaType: 'bilder',
        filters: [
          new Hint({ label: 'Oslo', value: 'subjectgeographic:"Oslo"' }),
        ],
      }),
    );
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('button[aria-label="Fjern Sted: Oslo"]')
      .click();
    expect(removed).toHaveBeenCalledWith({
      type: 'hint',
      label: 'Sted: Oslo',
      value: 'subjectgeographic:"Oslo"',
    });
    expect(removed).toHaveBeenCalledTimes(1);
  });

  it('lets the user draft a place refinement without submitting it', () => {
    const submit = jest.spyOn(component.chatSubmitted, 'emit');
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    buttons
      .find((button) => button.textContent?.trim() === 'Avgrens sted')!
      .click();
    expect(component.queryControl.value).toBe('Bare fra ');
    expect(submit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('input'),
    );
  });

  it('offers direct date removal when a date filter is active', () => {
    const removed = jest.spyOn(component.filterRemoved, 'emit');
    fixture.componentRef.setInput(
      'activeCriteria',
      new Criteria({
        date: new DateOption({
          value: 'date:[20010101 TO 49991231]',
          viewValue: 'Fra 2001',
        }),
      }),
    );
    fixture.detectChanges();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    buttons
      .find((button) => button.textContent?.trim() === 'Fjern datofilter')!
      .click();
    expect(removed).toHaveBeenCalledWith({ type: 'date', label: 'Dato' });
  });

  it('enables undo only when available and disables it while a request is pending', () => {
    const undo = jest.spyOn(component.undoRequested, 'emit');
    const button = fixture.nativeElement.querySelector(
      'button[aria-label="Angre siste endring i søket"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fixture.componentRef.setInput('canUndo', true);
    fixture.detectChanges();
    button.click();
    expect(undo).toHaveBeenCalledTimes(1);
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    expect(button.disabled).toBe(true);
  });
});
