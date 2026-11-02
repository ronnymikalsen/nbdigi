import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AiSearchStore } from '../../../ai-search/ai-search.store';
import { SearchFacade } from '../../../+state/search/search.facade';
import { AppFacade } from '../../../+state/app/app.facade';
import { Criteria } from '../../../core/models';
import { SearchBoxPageComponent } from './search-box-page';

describe('search page state isolation', () => {
  let component: SearchBoxPageComponent;
  let chat: { reset: jest.Mock };
  let classic: { clearAll: jest.Mock; searchAggs: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    chat = { reset: jest.fn() };
    classic = { clearAll: jest.fn(), searchAggs: jest.fn() };
    router = { navigate: jest.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: AiSearchStore, useValue: chat }],
    });
    component = TestBed.runInInjectionContext(
      () =>
        new SearchBoxPageComponent(
          { run: (callback: () => unknown) => callback() } as NgZone,
          router as unknown as Router,
          {
            ...classic,
            state$: of(null),
            getQ$: of(''),
            getCriteria$: of(new Criteria()),
          } as unknown as SearchFacade,
          {} as AppFacade,
        ),
    );
  });

  it('resets only the chat on the AI route', () => {
    component.chatOnly = true;
    component.onClearAll();
    expect(chat.reset).toHaveBeenCalledTimes(1);
    expect(classic.clearAll).not.toHaveBeenCalled();
    expect(classic.searchAggs).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('resets only classic search outside the AI route', () => {
    component.onClearAll();
    expect(chat.reset).not.toHaveBeenCalled();
    expect(classic.clearAll).toHaveBeenCalledTimes(1);
    expect(classic.searchAggs).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/search']);
  });
});
