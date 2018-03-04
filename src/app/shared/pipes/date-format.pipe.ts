import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(
    date: string,
    fromFormat: string = 'YYYYMMDD',
    toFormat: string = 'DD.MM.YYYY'
  ): string {
    if (date && date.length === 8) {
      return moment(date, 'YYYYMMDD').format('DD.MM.YYYY');
    } else {
      return date;
    }
  }
}
