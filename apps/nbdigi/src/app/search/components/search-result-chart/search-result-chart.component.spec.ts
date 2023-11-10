import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultChartComponent } from './search-result-chart.component';

describe('SearchResultChartComponent', () => {
  let component: SearchResultChartComponent;
  let fixture: ComponentFixture<SearchResultChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
