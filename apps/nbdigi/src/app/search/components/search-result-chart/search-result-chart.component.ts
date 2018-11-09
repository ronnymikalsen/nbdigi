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
import { Criteria, DateOption, YearCount } from '@nbdigi/data-models';
import {
  ChartRangeToOption,
  ChartStrategy,
  ChartStrategyFactory
} from './chart-strategy-factory';
@Component({
  selector: 'nbd-search-result-chart',
  templateUrl: './search-result-chart.component.html',
  styleUrls: ['./search-result-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultChartComponent implements OnInit, OnChanges {
  @Input() criteria: Criteria;
  @Input() years: YearCount[];
  @Input() months: YearCount[];
  @Output() previousChartRange = new EventEmitter<ChartRangeToOption>();
  @Output() chartDateChanged = new EventEmitter<DateOption>();
  @Output() currentChartChanged = new EventEmitter<string>();
  backDateOption: ChartRangeToOption;
  data = [];
  colorScheme = {
    domain: ['#00bcd4']
  };
  private chartStrategy: ChartStrategy;
  private force: string;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['months'] || changes['years']) {
      this.chartStrategy = ChartStrategyFactory.create(
        this.criteria,
        this.years,
        this.months,
        this.force
      );

      if (this.chartStrategy) {
        this.data = this.chartStrategy.createChart();
        this.backDateOption = this.chartStrategy.createBack();
        this.currentChartChanged.emit(this.chartStrategy.getName());
      }
    }
  }

  onSelect(event) {
    this.force = null;
    this.chartDateChanged.emit(this.chartStrategy.createQuery(event.name));
  }

  back() {
    this.force = this.backDateOption.to;
    this.previousChartRange.emit(this.backDateOption);
  }
}
