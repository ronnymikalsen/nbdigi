import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy } from './chart-strategy-factory';

export class DayChartStrategy implements ChartStrategy {
  constructor(private criteria: Criteria, private aggs: YearCount[]) {}
  createChart(): any[] {
    return [];
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
