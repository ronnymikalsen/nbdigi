import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { ChartOption } from '../../../models/char-option';
import { DateOption } from '../../../models/date-options';
import { YearCount } from '../../../models/year-count';
@Component({
  selector: 'app-search-result-chart',
  templateUrl: './search-result-chart.component.html',
  styleUrls: ['./search-result-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultChartComponent implements OnInit, OnChanges {
  @Input() chartRange: ChartOption;
  @Input() years: YearCount[];
  @Output() chartRangeChanged = new EventEmitter<ChartOption>();
  @Output() previousChartRange = new EventEmitter<void>();
  @Output() dateChanged = new EventEmitter<DateOption>();

  view: any[] = [700, 400];
  showYAxis = true;
  showXAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';
  mqAlias: string;

  single = [];

  constructor(public media: ObservableMedia) {
    this.media.subscribe(m => {
      this.mqAlias = m.mqAlias;
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['years']) {
      let r = [];
      if (this.years.length > 0) {
        if (this.chartRange.selection === 'year') {
          r = this.createYearChart(this.years);
        } else if (this.chartRange.selection === 'month') {
          r = this.createMonthChart(this.years);
        } else if (this.chartRange.selection === 'day') {
          r = this.createDayChart(this.years);
        } else {
          r = this.createCenturyChart(this.years);
        }
      }
      this.single = r;
    }
  }

  private createCenturyChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

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

  private createYearChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

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

  private createMonthChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

    const start = min;
    const end = max;
    const length = end - start + 1;
    console.log(years[0]);
    for (let i = 0; i < length; i++) {
      const y = start + i;
      const name = this.monthIndexToName(Number(years[0].year), y);
      r[i] = {
        name: name,
        value: 0
      };
    }

    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = x;
      const name = this.monthIndexToName(Number(years[0].year), y);
      const value =
        r[y - start] !== undefined ? r[y - start].value + v.value : 1;
      r[y - start] = {
        name: name,
        value: value
      };
    }
    return r;
  }

  private createDayChart(years: YearCount[]) {
    const newResult = [];
    const r = [];
    years.forEach(y => {
      newResult.push({
        name: y.year,
        value: y.count
      });
    });
    const min = Number(years[0].year);
    const max = Number(years[years.length - 1].year);
    const range = max - min;

    const start = min;
    const end = max;
    console.log(years[0]);
    for (let i = 0; i < newResult.length; i++) {
      const v = newResult[i];
      const x = Number(v.name);
      const y = x;
      const name = this.chartRange.viewValue;
      const value =
        r[y - start] !== undefined ? r[y - start].value + v.value : 1;
      r[y - start] = {
        name: name,
        value: value
      };
    }
    return r;
  }

  private monthIndexToName(year: number, index: number) {
    const date = new Date(year, index - 1, 1);
    return date.toLocaleString('nb-us', { month: 'long' });
  }

  private monthNameToIndex(name: string) {
    console.log(name);
    switch (name) {
      case 'januar':
        return 1;
      case 'februar':
        return 2;
      case 'mars':
        return 3;
      case 'april':
        return 4;
      case 'mai':
        return 5;
      case 'juni':
        return 6;
      case 'juli':
        return 7;
      case 'august':
        return 8;
      case 'september':
        return 9;
      case 'oktober':
        return 10;
      case 'november':
        return 11;
      case 'desember':
        return 12;
    }
  }

  onSelect(event) {
    if (
      this.chartRange.selection === 'century' ||
      this.chartRange.selection === 'responsive'
    ) {
      let value = 'select';
      if (event.name.indexOf(' - ') !== -1) {
        const range = event.name.split('-');
        const start = range[0].trim().padStart(4, '0');
        const end: string = `${Number(range[1].trim()) - 1}`.padStart(4, '0');
        value = `date:[${start}0101 TO ${end}1231]`;
      }
      this.chartRangeChanged.emit(
        new ChartOption({
          selection: 'year',
          value: value,
          year: event.name,
          viewValue: event.name
        })
      );
      this.dateChanged.emit(
        new DateOption({
          type: 'custom',
          value: value,
          viewValue: event.name
        })
      );
    } else if (this.chartRange.selection === 'year') {
      const start = event.name.padStart(4, '0');
      let value = 'select';
      value = `date:[${start}0101 TO ${start}1231]`;

      this.chartRangeChanged.emit(
        new ChartOption({
          selection: 'month',
          value: value,
          year: event.name,
          viewValue: event.name
        })
      );
      this.dateChanged.emit(
        new DateOption({
          type: 'custom',
          value: value,
          viewValue: event.name
        })
      );
    } else if (this.chartRange.selection === 'month') {
      console.log(this.chartRange);
      const prev = Number(this.chartRange.year);
      const monthIndex = this.monthNameToIndex(event.name);
      const monthIndexPadded = ('' + monthIndex).padStart(2, '0');
      const lastDay = (
        '' + new Date(prev, monthIndex + 1, 0).getDay()
      ).padStart(2, '0');
      let value = 'select';
      value = `date:[${prev}${monthIndexPadded}01 TO ${prev}${monthIndexPadded}${lastDay}]`;
      this.chartRangeChanged.emit(
        new ChartOption({
          selection: 'day',
          value: value,
          year: event.name,
          viewValue: event.name
        })
      );
      this.dateChanged.emit(
        new DateOption({
          type: 'custom',
          value: value,
          viewValue: event.name
        })
      );
    }
  }

  back() {
    this.previousChartRange.emit();
  }
}
