import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy } from './chart-strategy-factory';

export class MonthChartStrategy implements ChartStrategy {
  constructor(private criteria: Criteria, private aggs: YearCount[]) {}

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

  createBack() {
    const currentYear = this.criteria.date.fromDate.substring(0, 3);
    return new DateOption({
      fromDate: `${currentYear}10101`,
      toDate: `${currentYear}91231`,
      value: `date:[${currentYear}00101 TO ${currentYear}91231]`,
      viewValue: `${currentYear}0-${Number(currentYear) + 1}0`
    });
  }

  private monthIndexToName(year: number, index: number) {
    const date = new Date(year, index - 1, 1);
    return date.toLocaleString('nb-us', { month: 'long' });
  }
}
