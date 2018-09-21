import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { ChartStrategy } from './chart-strategy-factory';
import { MonthChartStrategy } from './month-chart-strategy';

export class DayChartStrategy extends MonthChartStrategy
  implements ChartStrategy {
  getName() {
    return 'DayChart';
  }

  getNext() {
    return 'DayChart';
  }

  createBack() {
    const currentYear = this.criteria.date.fromDate
      .padStart(4, '0')
      .substring(0, 4);
    return {
      to: 'MonthChart',
      date: new DateOption({
        fromDate: `${currentYear}0101`,
        toDate: `${currentYear}1231`,
        value: `date:[${currentYear}0101 TO ${currentYear}1231]`,
        viewValue: `${currentYear}`
      })
    };
  }
}
