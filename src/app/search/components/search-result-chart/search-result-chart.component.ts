import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ChartOption } from '../../../models/char-option';
import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy, ChartStrategyFactory } from './chart-strategy-factory';
@Component({
  selector: 'app-search-result-chart',
  templateUrl: './search-result-chart.component.html',
  styleUrls: ['./search-result-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultChartComponent implements OnInit, OnChanges {
  @Input() criteria: Criteria;
  @Input() years: YearCount[];
  @Input() months: YearCount[];
  @Output() chartRangeChanged = new EventEmitter<ChartOption>();
  @Output() previousChartRange = new EventEmitter<DateOption>();
  @Output() chartDateChanged = new EventEmitter<DateOption>();
  backDateOption: DateOption;
  data = [];
  colorScheme = {
    domain: ['#00bcd4']
  };
  private chartStrategy: ChartStrategy;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['months'] || changes['years']) {
      this.chartStrategy = ChartStrategyFactory.create(
        this.criteria,
        this.years,
        this.months
      );

      if (this.chartStrategy) {
        this.data = this.chartStrategy.createChart();
        this.backDateOption = this.chartStrategy.createBack();
      }
    }
  }

  onSelect(event) {
    this.chartDateChanged.emit(this.chartStrategy.createQuery(event.name));
  }

  back() {
    this.previousChartRange.emit(this.backDateOption);
  }
}
