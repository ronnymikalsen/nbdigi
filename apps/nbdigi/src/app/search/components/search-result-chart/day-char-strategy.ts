import { DateOption, DateOptions } from '../../../core/models';
import { ChartStrategy } from './chart-strategy-factory';
import { MonthChartStrategy } from './month-chart-strategy';

export class DayChartStrategy extends MonthChartStrategy
  implements ChartStrategy {
  override getName() {
    return 'DayChart';
  }

  override getNext() {
    return 'DayChart';
  }

  override createBack() {
    if (this.criteria.date.fromDate) {
      const currentYear = this.criteria.date.fromDate
        .padStart(4, '0')
        .substring(0, 4);
      return {
        to: 'MonthChart',
        date: new DateOption({
          fromDate: `${currentYear}0101`,
          toDate: `${currentYear}1231`,
          type: new DateOptions().customDate.type,
          value: `date:[${currentYear}0101 TO ${currentYear}1231]`,
          viewValue: `${currentYear}`
        })
      };
    } else {
      throw new Error('No from date');
    }
  }
}
