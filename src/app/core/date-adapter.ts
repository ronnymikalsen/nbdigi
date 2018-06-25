import { Injectable } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

@Injectable()
export class DateAdapter extends MomentDateAdapter {
  parse(value: any, parseFormat: string | string[]): Moment | null {
    const reg = new RegExp(/^\d{4}$/);
    if (reg.test(value)) {
      value = '01.01.' + value;
    }
    return super.parse(value, parseFormat);
  }
}
