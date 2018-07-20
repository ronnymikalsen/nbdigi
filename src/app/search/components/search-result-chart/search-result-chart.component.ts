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
import { ObservableMedia } from '@angular/flex-layout';
import { ChartOption } from '../../../models/char-option';
import { Criteria } from '../../../models/criteria';
import { DateOption, DateOptions } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
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
  single = [];

  constructor(public media: ObservableMedia) {
    this.media.subscribe(m => {
      this.mqAlias = m.mqAlias;
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    let r = [];
    if (changes['months'] || changes['years']) {
      if (
        this.criteria.date.fromDate.substring(0, 6) ===
        this.criteria.date.toDate.substring(0, 6)
      ) {
        r = this.createDayChart(this.months);
        const currentYear = this.criteria.date.fromDate.substring(0, 4);
        this.backDateOption = new DateOption({
          fromDate: `${currentYear}0101`,
          toDate: `${currentYear}1231`,
          value: `date:[${currentYear}0101 TO ${currentYear}1231]`,
          viewValue: `${currentYear}`
        });
      } else if (
        this.criteria.date.fromDate.substring(0, 4) ===
        this.criteria.date.toDate.substring(0, 4)
      ) {
        const currentYear = this.criteria.date.fromDate.substring(0, 2);
        r = this.createMonthChart(this.months);
        this.backDateOption = new DateOption({
          fromDate: `${currentYear}010101`,
          toDate: `${currentYear}991231`,
          value: `date:[${currentYear}000101 TO ${currentYear}991231]`,
          viewValue: `${currentYear}00-${Number(currentYear) + 1}00`
        });
      }
      if (this.years.length > 0) {
        const first = this.years[0].year.padStart(4, '0').substring(0, 2);
        const last = this.years[this.years.length - 1].year
          .padStart(4, '0')
          .substring(0, 2);
        if (first === last) {
          r = this.createYearChart(this.years);
          this.backDateOption = new DateOptions().anytime;
        }

        if (first !== last) {
          r = this.createCenturyChart(this.years);
          this.backDateOption = undefined;
        }
      }
    }
    this.single = r;
  }

  private createCenturyChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

    const start = Math.floor(min / 100);
    const end = Math.floor(max / 100);
    const length = end - start;
    for (let i = 0; i < length; i++) {
      const year = start + i;
      const name = `${year * 100} - ${year * 100 + 100}`;
      r[i] = {
        name: name,
        value: 0
      };
    }

    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = Math.floor(x / 100);
      const name = `${y * 100} - ${y * 100 + 100}`;
      const value =
        r[y - start] !== undefined ? r[y - start].value + v.value : 1;
      r[y - start] = {
        name: name,
        value: value
      };
    }
    return r;
  }

  private createYearChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

    const start = min;
    const end = max;
    const length = end - start + 1;
    for (let i = 0; i < length; i++) {
      const year = start + i;
      const name = `${year}`;
      r[i] = {
        name: name,
        value: 0
      };
    }

    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = x;
      const name = `${y}`;
      const value =
        r[y - start] !== undefined ? r[y - start].value + v.value : 1;
      r[y - start] = {
        name: name,
        value: value
      };
    }
    return r;
  }

  private createMonthChart(years: YearCount[]) {
    if (!years || years.length === 0) {
      return [];
    }
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

    const start = min;
    const end = max;
    const length = end - start + 1;
    for (let i = 0; i < length; i++) {
      const y = start + i;
      const name = this.monthIndexToName(Number(years[0].year), y);
      r[i] = {
        name: name,
        value: 0
      };
    }

    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = x;
      const name = this.monthIndexToName(Number(years[0].year), y);
      const value =
        r[y - start] !== undefined ? r[y - start].value + v.value : 1;
      r[y - start] = {
        name: name,
        value: value
      };
    }
    return r;
  }

  private createDayChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

    const start = min;
    const end = max;
    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = x;
      const name = this.chartRange.viewValue;
      const value =
        r[y - start] !== undefined ? r[y - start].value + v.value : 1;
      r[y - start] = {
        name: name,
        value: value
      };
    }
    return r;
  }

  private monthIndexToName(year: number, index: number) {
    const date = new Date(year, index - 1, 1);
    return date.toLocaleString('nb-us', { month: 'long' });
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

  onSelect(event) {
    if (event.name.length === 0) {
      return;
    }
    if (event.name.indexOf('-') !== -1) {
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

  private capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
}
