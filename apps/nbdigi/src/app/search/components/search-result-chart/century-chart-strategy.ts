import {
  Criteria,
  DateOption,
  DateOptions,
  YearCount
} from '../../../core/models';
import { ChartRangeToOption, ChartStrategy } from './chart-strategy-factory';

export class CenturyChartStrategy implements ChartStrategy {
  constructor(private criteria: Criteria, private aggs: YearCount[]) {}

  getName() {
    return 'CenturyChart';
  }

  getNext() {
    return 'DecadeChart';
  }

  createChart(): any[] {
    const newResult = [];
    const r = [];
    this.aggs.forEach(y => {
      const first = Math.floor(Number(y.year) / 100) + '00';
      newResult.push({
        first: first,
        name: y.year,
        value: y.count
      });
    });

    const min = Math.floor(Number(newResult[0].first) / 100);
    const max = Number(newResult[newResult.length - 1].first) / 100;
    const length = max - min;
    for (let i = 0; i <= length; i++) {
      const year = (min + i) * 100;
      const decade = year < 100 ? '' : year.toString().substring(0, 2);
      const yearEnd = decade + '99';
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
      const first = Math.floor(Number(x) / 100) + '00';

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

  createBack(): ChartRangeToOption {
    return {
      to: 'MillenniumChart',
      date: new DateOptions().anytime
    };
  }

  createQuery(selection: string): DateOption {
    const fromYear = selection
      .substring(0, selection.indexOf('-'))
      .trim()
      .padStart(4, '0')
      .substring(0, 4);
    const toYear = selection
      .substring(selection.indexOf('-') + 1)
      .trim()
      .padStart(4, '0')
      .substring(0, 4);
    return new DateOption({
      fromDate: `${fromYear}0101`,
      toDate: `${toYear}1231`,
      type: new DateOptions().customDate.type,
      value: `date:[${fromYear}0101 TO ${toYear}1231]`,
      viewValue: `${selection}`
    });
  }
}
