import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

import { SearchBoxComponent } from './search-box.component';
import { Criteria, DateOption, Item } from '../../../../core/models';

registerLocaleData(localeNo, 'nb_NO');

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
    fixture.componentRef.setInput('chatOnly', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('leaves the normal search input available outside the dedicated chat route', () => {
    fixture.componentRef.setInput('chatOnly', false);
    fixture.componentRef.setInput('q', 'hunder');
    fixture.detectChanges();
    expect(component.chatMode).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="log"]')).toBeNull();
    expect(component.queryControl.value).toBe('hunder');
    expect(
      fixture.nativeElement.querySelector('a[routerLink="/ai-search"]'),
    ).not.toBeNull();
  });

  it('renders result cards underneath their own answer without filter chips', () => {
    fixture.componentRef.setInput('messages', [
      { role: 'user', text: 'Bilder av hunder' },
      {
        role: 'assistant',
        text: 'Fant 42 treff.',
        total: 42,
        resultGroups: [
          {
            mediaType: 'bilder',
            label: 'Bilder',
            totalElements: 42,
            items: [new Item({ id: 'dog', title: 'Hund' })],
          },
        ],
      },
      { role: 'user', text: 'Etter 2000' },
      {
        role: 'assistant',
        text: 'Fant 1 treff.',
        total: 1,
        resultGroups: [
          {
            mediaType: 'bilder',
            label: 'Bilder',
            totalElements: 1,
            items: [new Item({ id: 'new-dog', title: 'Ny hund' })],
          },
        ],
      },
    ]);
    fixture.detectChanges();
    const turns = fixture.nativeElement.querySelectorAll('.chat-turn');
    expect(turns[0].querySelector('nbd-chat-result-grid')).toBeNull();
    expect(turns[1].querySelector('nbd-chat-result-grid').items[0].id).toBe(
      'dog',
    );
    expect(turns[3].querySelector('nbd-chat-result-grid').items[0].id).toBe(
      'new-dog',
    );
    expect(turns[1].querySelector('.result-heading').textContent).toContain(
      '42 treff',
    );
    expect(fixture.nativeElement.querySelector('mat-chip-set')).toBeNull();
  });

  it('renders books and photos in separate named sections with their own counts', () => {
    fixture.componentRef.setInput('messages', [
      {
        role: 'assistant',
        text: 'Fant 207 treff.',
        total: 207,
        resultGroups: [
          {
            mediaType: 'bøker',
            label: 'Bøker',
            totalElements: 124,
            items: [new Item({ id: 'book', title: 'Hundebok' })],
          },
          {
            mediaType: 'bilder',
            label: 'Bilder',
            totalElements: 83,
            items: [new Item({ id: 'photo', title: 'Hundebilde' })],
          },
        ],
      },
    ]);
    fixture.detectChanges();
    const sections =
      fixture.nativeElement.querySelectorAll('.chat-result-group');
    expect(sections).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('ngu-carousel')).toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('nbd-chat-result-grid'),
    ).toHaveLength(2);
    expect(sections[0].getAttribute('aria-label')).toBe('Bøker');
    expect(sections[0].querySelector('h3').textContent).toContain('124 treff');
    expect(sections[0].querySelector('nbd-chat-result-grid').items[0].id).toBe(
      'book',
    );
    expect(sections[0].querySelector('nbd-chat-result-grid').compact).toBe(
      false,
    );
    expect(sections[1].getAttribute('aria-label')).toBe('Bilder');
    expect(sections[1].querySelector('h3').textContent).toContain('83 treff');
    expect(sections[1].querySelector('nbd-chat-result-grid').items[0].id).toBe(
      'photo',
    );
    expect(sections[1].querySelector('nbd-chat-result-grid').compact).toBe(
      true,
    );
  });

  it('scrolls to the beginning of the new answer so its results are visible', () => {
    const original = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollIntoView',
    );
    const scroll = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scroll,
    });
    try {
      fixture.componentRef.setInput('messages', [
        { role: 'user', text: 'Bilder' },
      ]);
      fixture.detectChanges();
      fixture.componentRef.setInput('messages', [
        { role: 'user', text: 'Bilder' },
        { role: 'assistant', text: 'Fant 100 treff.' },
      ]);
      fixture.detectChanges();
      expect(scroll).toHaveBeenLastCalledWith({ block: 'start' });
      expect(scroll.mock.contexts.at(-1)).toBe(
        fixture.nativeElement.querySelectorAll('.chat-turn')[1],
      );
    } finally {
      if (original)
        Object.defineProperty(
          HTMLElement.prototype,
          'scrollIntoView',
          original,
        );
      else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
    }
  });

  it('submits the next-page request directly and preserves the current draft', () => {
    const submit = jest.spyOn(component.chatSubmitted, 'emit');
    fixture.componentRef.setInput('messages', [
      {
        role: 'assistant',
        text: 'Bilder',
        resultGroups: [
          {
            mediaType: 'bilder',
            label: 'Bilder',
            totalElements: 100,
            nextLink: 'https://api.nb.no/catalog/v1/items?page=1',
            items: [new Item({ id: 'photo' })],
          },
        ],
      },
    ]);
    fixture.detectChanges();
    const grid = fixture.nativeElement.querySelector('nbd-chat-result-grid');
    expect(grid.canLoadMore).toBe(true);
    component.queryControl.setValue('Mitt utkast');
    fixture.debugElement
      .query(By.css('nbd-chat-result-grid'))
      .triggerEventHandler('moreRequested', 'Vis flere bilder');
    expect(submit).toHaveBeenCalledWith('Vis flere bilder');
    expect(component.queryControl.value).toBe('Mitt utkast');
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('nbd-chat-result-grid'))
      .triggerEventHandler('moreRequested', 'Vis flere bilder');
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it.each([
    [320, 4],
    [800, 8],
    [1100, 12],
    [240, 2],
  ])('requests two rows at a container width of %i', (width, count) => {
    const area = component.resultArea?.nativeElement;
    if (!area) throw new Error('Missing result area');
    jest
      .spyOn(area, 'getBoundingClientRect')
      .mockReturnValue({ width } as DOMRect);
    expect(component.defaultResultLimit()).toBe(count);
  });

  it('identifies the sender to screen readers without a visible user label', () => {
    fixture.componentRef.setInput('messages', [
      { role: 'user', text: 'Bilder av hunder' },
      { role: 'assistant', text: 'Fant 4 treff.' },
    ]);
    fixture.detectChanges();
    const turns = fixture.nativeElement.querySelectorAll('.chat-turn');
    expect(turns[0].querySelector('.user-sender').textContent).toContain(
      'Din melding:',
    );
    expect(turns[0].querySelector('strong')).toBeNull();
    expect(turns[1].querySelector('strong').textContent).toBe('Nbdigi');
  });

  it('shows a Material spinner and a readable thinking status while pending', () => {
    expect(fixture.nativeElement.querySelector('.chat-status')).toBeNull();
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    const status = fixture.nativeElement.querySelector('.chat-status');
    expect(status.getAttribute('role')).toBe('status');
    expect(status.textContent).toContain('Tenker …');
    expect(
      status.querySelector('mat-spinner').getAttribute('aria-hidden'),
    ).toBe('true');
    expect(status.querySelector('mat-icon.status-static')).not.toBeNull();
    fixture.componentRef.setInput('pendingLabel', 'Søker i katalogen …');
    fixture.detectChanges();
    expect(status.textContent).toContain('Søker i katalogen …');
    fixture.componentRef.setInput('pending', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.chat-status')).toBeNull();
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
    expect(fixture.nativeElement.querySelector('.active-search')).toBeNull();
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
