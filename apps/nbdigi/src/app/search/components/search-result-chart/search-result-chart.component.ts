import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Criteria, DateOption, YearCount } from '../../../core/models';
import {
  ChartRangeToOption,
  ChartStrategy,
  ChartStrategyFactory,
} from './chart-strategy-factory';
@Component({
  selector: 'nbd-search-result-chart',
  templateUrl: './search-result-chart.component.html',
  styleUrls: ['./search-result-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SearchResultChartComponent implements OnInit, OnChanges {
  @Input() criteria!: Criteria | undefined;
  @Input() years!: YearCount[] | null;
  @Input() months!: YearCount[] | null;
  @Output() previousChartRange = new EventEmitter<ChartRangeToOption>();
  @Output() chartDateChanged = new EventEmitter<DateOption>();
  @Output() currentChartChanged = new EventEmitter<string>();
  backDateOption!: ChartRangeToOption | undefined;
  data: any[] = [];
  readonly colorScheme: Color = {
    name: 'nbdigi',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00bcd4'],
  };
  private chartStrategy!: ChartStrategy | undefined;
  private force: string | undefined;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['months'] || changes['years']) {
      this.chartStrategy = ChartStrategyFactory.create(
        this.criteria,
        this.years,
        this.months,
        this.force,
      );

      if (this.chartStrategy) {
        this.data = this.chartStrategy.createChart();
        this.backDateOption = this.chartStrategy.createBack();
        this.currentChartChanged.emit(this.chartStrategy.getName());
      }
    }
  }

  onSelect(event: any) {
    if (this.chartStrategy) {
      this.force = undefined;
      this.chartDateChanged.emit(this.chartStrategy.createQuery(event.name));
    }
  }

  back() {
    this.force = this.backDateOption?.to;
    this.previousChartRange.emit(this.backDateOption);
  }
}
