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
import { ChartStrategyFactory, ChartStrategy } from './chart-strategy-factory';
@Component({
  selector: 'app-search-result-chart',
  templateUrl: './search-result-chart.component.html',
  styleUrls: ['./search-result-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultChartComponent implements OnInit, OnChanges {
  @Input() criteria: Criteria;
  @Input() chartRange: ChartOption;
  @Input() years: YearCount[];
  @Input() months: YearCount[];
  @Output() chartRangeChanged = new EventEmitter<ChartOption>();
  @Output() previousChartRange = new EventEmitter<DateOption>();
  @Output() chartDateChanged = new EventEmitter<DateOption>();

  backDateOption: DateOption;
  view: any[] = [700, 600];
  showYAxis = true;
  showXAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';
  mqAlias: string;
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
    if (event.name.length === 0) {
      return;
    }
    console.log(this.chartStrategy);

    if (event.name.indexOf('-') !== -1 && event.name.length === 11) {
      const fromYear = event.name.substring(0, 4);
      const toYear = Number(event.name.substring(7)) - 1;
      this.chartDateChanged.emit(
        new DateOption({
          fromDate: `${fromYear}0101`,
          toDate: `${toYear}1231`,
          value: `date:[${fromYear}0101 TO ${toYear}1231]`,
          viewValue: `${event.name}`
        })
      );
    } else if (event.name.indexOf('-') !== -1 && event.name.length === 9) {
      const fromYear = event.name.substring(0, 4);
      const toYear = Number(
        event.name.substring(0, 2) + event.name.substring(7)
      );
      this.chartDateChanged.emit(
        new DateOption({
          fromDate: `${fromYear}0101`,
          toDate: `${toYear}1231`,
          value: `date:[${fromYear}0101 TO ${toYear}1231]`,
          viewValue: `${event.name}`
        })
      );
    } else if (!isNaN(event.name)) {
      this.chartDateChanged.emit(
        new DateOption({
          fromDate: `${event.name}0101`,
          toDate: `${event.name}1231`,
          value: `date:[${event.name}0101 TO ${event.name}1231]`,
          viewValue: `${event.name}`
        })
      );
    } else {
      const currentYear = Number(this.criteria.date.fromDate.substring(0, 4));
      const monthIndex = Number(this.monthNameToIndex(event.name));
      const monthIndexPadded = ('' + monthIndex).padStart(2, '0');
      const daysInMonth = this.daysInMonth(monthIndex, currentYear);
      const lastDay = ('' + daysInMonth).padStart(2, '0');
      const fromDate = `${currentYear}${monthIndexPadded}01`;
      const toDate = `${currentYear}${monthIndexPadded}${lastDay}`;
      const value = `date:[${fromDate} TO ${toDate}]`;
      const viewValue = this.capitalizeFirstLetter(
        `${event.name} ${currentYear}`
      );
      this.chartDateChanged.emit(
        new DateOption({
          fromDate: `${fromDate}`,
          toDate: `${toDate}`,
          value: `${value}`,
          viewValue: `${viewValue}`
        })
      );
    }
  }

  back() {
    this.previousChartRange.emit(this.backDateOption);
  }

  private monthNameToIndex(name: string) {
    switch (name) {
      case 'januar':
        return 1;
      case 'februar':
        return 2;
      case 'mars':
        return 3;
      case 'april':
        return 4;
      case 'mai':
        return 5;
      case 'juni':
        return 6;
      case 'juli':
        return 7;
      case 'august':
        return 8;
      case 'september':
        return 9;
      case 'oktober':
        return 10;
      case 'november':
        return 11;
      case 'desember':
        return 12;
    }
  }

  private capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
}
