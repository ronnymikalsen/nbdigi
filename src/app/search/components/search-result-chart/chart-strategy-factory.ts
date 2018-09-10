import { Criteria } from '../../../models/criteria';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
import { CenturyChartStrategy } from './century-chart-strategy';
import { DayChartStrategy } from './day-char-strategy';
import { DecadeChartStrategy } from './decade-chart-strategy';
import { MillenniumChartStrategy } from './millennium-chart-strategy';
import { MonthChartStrategy } from './month-chart-strategy';
import { YearChartStrategy } from './year-chart-strategy.';

export class ChartStrategyFactory {
  public static create(
    criteria: Criteria,
    yearAggs: YearCount[],
    monthAggs: YearCount[]
  ): ChartStrategy {
    if (
      criteria.date.fromDate.substring(0, 6) ===
      criteria.date.toDate.substring(0, 6)
    ) {
      return new DayChartStrategy(criteria, yearAggs);
    } else if (
      criteria.date.fromDate.substring(0, 4) ===
      criteria.date.toDate.substring(0, 4)
    ) {
      return new MonthChartStrategy(criteria, monthAggs);
    } else if (yearAggs.length > 0) {
      const first = yearAggs[0].year.padStart(4, '0').substring(0, 2);
      const last = yearAggs[yearAggs.length - 1].year
        .padStart(4, '0')
        .substring(0, 2);
      if (
        Number(yearAggs[yearAggs.length - 1].year) - Number(yearAggs[0].year) >
        1000
      ) {
        return new MillenniumChartStrategy(criteria, yearAggs);
      } else if (
        first === last &&
        Number(yearAggs[yearAggs.length - 1].year) - Number(yearAggs[0].year) >
          9
      ) {
        return new DecadeChartStrategy(criteria, yearAggs);
      } else if (first === last) {
        return new YearChartStrategy(criteria, yearAggs);
      } else if (first !== last) {
        return new CenturyChartStrategy(criteria, yearAggs);
      }
    }
  }
}

export interface ChartStrategy {
  createChart(): any[];
  createBack(): DateOption;
  createQuery(selection: string): DateOption;
}
