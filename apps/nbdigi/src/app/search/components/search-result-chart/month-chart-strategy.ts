import {
  Criteria,
  DateOption,
  DateOptions,
  YearCount
} from '@nbdigi/data-models';
import { ChartRangeToOption, ChartStrategy } from './chart-strategy-factory';

export class MonthChartStrategy implements ChartStrategy {
  constructor(protected criteria: Criteria, private aggs: YearCount[]) {}

  getName() {
    return 'MonthChart';
  }

  getNext() {
    return 'DayChart';
  }

  createChart(): any[] {
    if (!this.aggs || this.aggs.length === 0) {
      return [];
    }
    const newResult = [];
    const r = [];
    this.aggs.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(this.aggs[0].year);
    const max = Number(this.aggs[this.aggs.length - 1].year);

    const start = min;
    const end = max;
    const length = end - start + 1;
    for (let i = 0; i < length; i++) {
      const y = start + i;
      const name = this.monthIndexToName(Number(this.aggs[0].year), y);
      r[i] = {
        name: name,
        value: 0
      };
    }

    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = x;
      const name = this.monthIndexToName(Number(this.aggs[0].year), y);
      const value =
        r[y - start] !== undefined ? r[y - start].value + v.value : 1;
      r[y - start] = {
        name: name,
        value: value
      };
    }
    return r;
  }

  createBack(): ChartRangeToOption {
    const currentYear = this.criteria.date.fromDate.substring(0, 3);
    const startYearLabel = Number(`${currentYear}0`);
    const endYearLabel = Number(`${currentYear}9`);
    return {
      to: 'YearChart',
      date: new DateOption({
        fromDate: `${currentYear}10101`,
        toDate: `${currentYear}91231`,
        value: `date:[${currentYear}00101 TO ${currentYear}91231]`,
        viewValue: `${startYearLabel}-${endYearLabel}`
      })
    };
  }

  createQuery(selection: string): DateOption {
    const currentYear = Number(this.criteria.date.fromDate.substring(0, 4));
    const monthIndex = Number(this.monthNameToIndex(selection));
    const monthIndexPadded = ('' + monthIndex).padStart(2, '0');
    const daysInMonth = this.daysInMonth(monthIndex, currentYear);
    const lastDay = ('' + daysInMonth).padStart(2, '0');
    const fromDate = `${currentYear}${monthIndexPadded}01`;
    const toDate = `${currentYear}${monthIndexPadded}${lastDay}`;
    const value = `date:[${fromDate} TO ${toDate}]`;
    const viewValue = this.capitalizeFirstLetter(`${selection} ${currentYear}`);
    return new DateOption({
      fromDate: `${fromDate}`,
      toDate: `${toDate}`,
      type: new DateOptions().customDate.type,
      value: `${value}`,
      viewValue: `${viewValue}`
    });
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

  private capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
}
