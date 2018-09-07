import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy } from './chart-strategy-factory';

export class DayChartStrategy implements ChartStrategy {
  constructor(private criteria: Criteria, private aggs: YearCount[]) {}
  createChart(): any[] {
    const r = [];
    if (this.aggs && this.aggs.length > 0) {
      const newResult = [];
      this.aggs.forEach(y => {
        newResult.push({
          name: y.year,
          value: y.count
        });
      });
      const min = Number(this.aggs[0].year);
      const max = Number(this.aggs[this.aggs.length - 1].year);

      const start = min;
      for (let i = 0; i < newResult.length; i++) {
        const v = newResult[i];
        const x = Number(v.name);
        const y = x;
        const name = '';
        const value =
          r[y - start] !== undefined ? r[y - start].value + v.value : 1;
        r[y - start] = {
          name: name,
          value: value
        };
      }
    }
    return r;
  }
  createBack() {
    const currentYear = this.criteria.date.fromDate.substring(0, 4);
    return new DateOption({
      fromDate: `${currentYear}0101`,
      toDate: `${currentYear}1231`,
      value: `date:[${currentYear}0101 TO ${currentYear}1231]`,
      viewValue: `${currentYear}`
    });
  }

  createQuery(selection: string): DateOption {
    return null;
  }
}
