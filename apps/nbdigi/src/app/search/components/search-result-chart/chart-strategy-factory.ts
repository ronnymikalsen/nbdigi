import { Criteria, DateOption, YearCount } from '../../../core/models';
import { CenturyChartStrategy } from './century-chart-strategy';
import { DayChartStrategy } from './day-char-strategy';
import { DecadeChartStrategy } from './decade-chart-strategy';
import { MillenniumChartStrategy } from './millennium-chart-strategy';
import { MonthChartStrategy } from './month-chart-strategy';
import { YearChartStrategy } from './year-chart-strategy.';

export class ChartStrategyFactory {
  public static create(
    criteria: Criteria | undefined,
    yearAggs: YearCount[] | null,
    monthAggs: YearCount[] | null,
    force?: string,
  ): ChartStrategy | undefined {
    if (!criteria || !yearAggs || !monthAggs) {
      return undefined;
    }
    if (force === 'MillenniumChart') {
      return new MillenniumChartStrategy(criteria, yearAggs);
    } else if (force === 'CenturyChart') {
      return new CenturyChartStrategy(criteria, yearAggs);
    } else if (force === 'DecadeChart') {
      return new DecadeChartStrategy(criteria, yearAggs);
    } else if (force === 'YearChart') {
      return new YearChartStrategy(criteria, yearAggs);
    } else if (force === 'MonthChart') {
      return new MonthChartStrategy(criteria, monthAggs);
    } else {
      if (
        criteria.date.fromDate &&
        criteria.date.toDate &&
        criteria.date.fromDate.substring(0, 6) ===
          criteria.date.toDate.substring(0, 6)
      ) {
        return new DayChartStrategy(criteria, yearAggs);
      } else if (
        criteria.date.fromDate &&
        criteria.date.toDate &&
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
          Number(yearAggs[yearAggs.length - 1].year) -
            Number(yearAggs[0].year) >
          1000
        ) {
          return new MillenniumChartStrategy(criteria, yearAggs);
        } else if (
          first === last &&
          Number(yearAggs[yearAggs.length - 1].year) -
            Number(yearAggs[0].year) >
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
    return undefined;
  }
}

export interface ChartStrategy {
  getName(): string;
  getNext(): string;
  createChart(): any[];
  createBack(): ChartRangeToOption | undefined;
  createQuery(selection: string): DateOption;
}

export interface ChartRangeToOption {
  to: string;
  date: DateOption;
}
