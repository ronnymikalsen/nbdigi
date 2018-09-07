import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy } from './chart-strategy-factory';

export class YearChartStrategy implements ChartStrategy {
  constructor(private criteria: Criteria, private aggs: YearCount[]) {}
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
  createBack() {
    const first = this.aggs[0].year.padStart(4, '0').substring(0, 2);
    return new DateOption({
      fromDate: `${first}010101`,
      toDate: `${first}991231`,
      value: `date:[${first}000101 TO ${first}991231]`,
      viewValue: `${first}00-${Number(first) + 1}00`
    });
  }

  createQuery(selection: string): DateOption {
    return new DateOption({
      fromDate: `${selection}0101`,
      toDate: `${selection}1231`,
      value: `date:[${selection}0101 TO ${selection}1231]`,
      viewValue: `${selection}`
    });
  }
}
