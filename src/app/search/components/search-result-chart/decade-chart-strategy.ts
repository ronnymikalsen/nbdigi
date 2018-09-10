import { Criteria } from '../../../models/criteria';
import { DateOption, DateOptions } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy } from './chart-strategy-factory';

export class DecadeChartStrategy implements ChartStrategy {
  constructor(private criteria: Criteria, private aggs: YearCount[]) {}
  createChart(): any[] {
    const newResult = [];
    const r = [];
    this.aggs.forEach(y => {
      const first = Math.floor(Number(y.year) / 10) + '0';
      newResult.push({
        first: first,
        name: y.year,
        value: y.count
      });
    });
    const min = Number(this.aggs[0].year.substring(0, 3) + '0');
    const max = Number(this.aggs[this.aggs.length - 1].year);

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
  createBack() {
    const first = this.aggs[0].year.padStart(4, '0').substring(0, 1);
    return new DateOption({
      fromDate: `${first}0000101`,
      toDate: `${first}9991231`,
      value: `date:[${first}0000101 TO ${first}9991231]`,
      viewValue: `${first}000-${first}999`
    });
  }

  createQuery(selection: string): DateOption {
    const fromYear = selection.substring(0, 4);
    const toYear = Number(selection.substring(0, 2) + selection.substring(7));
    return new DateOption({
      fromDate: `${fromYear}0101`,
      toDate: `${toYear}1231`,
      value: `date:[${fromYear}0101 TO ${toYear}1231]`,
      viewValue: `${selection}`
    });
  }
}
