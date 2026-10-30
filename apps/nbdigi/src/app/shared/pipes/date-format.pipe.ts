import { Inject, Pipe, PipeTransform } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';

@Pipe({
  name: 'dateFormat',
  standalone: false,
})
export class DateFormatPipe implements PipeTransform {
  constructor(@Inject(MAT_DATE_LOCALE) public locale: any) {
    moment.locale(locale);
  }

  transform(date: string, fromFormat = 'YYYYMMDD', toFormat = 'll'): string {
    if (date && date.length === 8) {
      return moment(date, fromFormat).format(toFormat);
    } else {
      return date;
    }
  }
}
