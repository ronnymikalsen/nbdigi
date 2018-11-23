import {
  Criteria,
  DateOption,
  DateOptions,
  YearCount
} from '../../../core/models';
import { ChartRangeToOption, ChartStrategy } from './chart-strategy-factory';

export class YearChartStrategy implements ChartStrategy {
  constructor(private criteria: Criteria, private aggs: YearCount[]) {}

  getName() {
    return 'YearChart';
  }

  getNext() {
    return 'MonthChart';
  }

  createChart(): any[] {
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

  createBack(): ChartRangeToOption {
    const first = this.aggs[0].year.padStart(4, '0').substring(0, 2);
    const startYearLabel = Number(`${first}00`);
    const endYearLabel = Number(`${first}99`);
    return {
      to: 'DecadeChart',
      date: new DateOption({
        fromDate: `${first}000101`,
        toDate: `${first}991231`,
        value: `date:[${first}000101 TO ${first}991231]`,
        viewValue: `${startYearLabel}-${endYearLabel}`
      })
    };
  }

  createQuery(selection: string): DateOption {
    const year = selection.padStart(4, '0');

    return new DateOption({
      fromDate: `${year}0101`,
      toDate: `${year}1231`,
      type: new DateOptions().customDate.type,
      value: `date:[${year}0101 TO ${year}1231]`,
      viewValue: `${Number(year)}`
    });
  }
}
