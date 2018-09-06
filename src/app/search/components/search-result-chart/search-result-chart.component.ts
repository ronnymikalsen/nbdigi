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
        r = this.createMonthChart(this.months);
        const currentYear = this.criteria.date.fromDate.substring(0, 3);
        this.backDateOption = new DateOption({
          fromDate: `${currentYear}10101`,
          toDate: `${currentYear}91231`,
          value: `date:[${currentYear}00101 TO ${currentYear}91231]`,
          viewValue: `${currentYear}0-${Number(currentYear) + 1}0`
        });
      }
      if (this.years.length > 0) {
        const first = this.years[0].year.padStart(4, '0').substring(0, 2);
        const last = this.years[this.years.length - 1].year
          .padStart(4, '0')
          .substring(0, 2);
        if (
          first === last &&
          Number(this.years[this.years.length - 1].year) -
            Number(this.years[0].year) >
            9
        ) {
          r = this.createDecadeChart(this.years);
          this.backDateOption = new DateOptions().anytime;
        } else if (first === last) {
          r = this.createYearChart(this.years);
          this.backDateOption = new DateOption({
            fromDate: `${first}010101`,
            toDate: `${first}991231`,
            value: `date:[${first}000101 TO ${first}991231]`,
            viewValue: `${first}00-${Number(first) + 1}00`
          });
        } else if (first !== last) {
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

  private createDecadeChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      const first = Math.floor(Number(y.year) / 10) + '0';
      newResult.push({
        first: first,
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year.substring(0, 3) + '0');
    const max = Number(years[years.length - 1].year);

    const start = min;
    const end = max;
    const length =
      Math.floor(Number(end) / 10) - Math.floor(Number(start) / 10) + 1;
    for (let i = 0; i < length; i++) {
      const year = start + i * 10;
      const yearEnd = (year + 9).toString().substring(2);
      const name = `${year} - ${yearEnd}`;
      r[i] = {
        first: year,
        name: name,
        value: 0
      };
    }
    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = x;
      const first = Math.floor(Number(x) / 10) + '0';

      const index = r.findIndex(va => Number(va.first) === Number(first));
      if (index === -1) {
        console.log('r', r);
        console.log('first', first);
      }
      try {
        r[index] = {
          ...r[index],
          value: Number(r[index].value) + Number(v.value)
        };
      } catch (e) {
        console.error(e);
      }
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

    const start = min;
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

  private capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  private groupBy(ary, keyFunc) {
    const r = {};
    ary.forEach(function(x) {
      const y = keyFunc(x);
      r[y] = (r[y] || []).concat(x);
    });
    return Object.keys(r).map(function(y) {
      return r[y];
    });
  }
}
