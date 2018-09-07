import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy } from './chart-strategy-factory';

export class CenturyChartStrategy implements ChartStrategy {
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
  createBack(): DateOption {
    return undefined;
  }
}
