import * as moment from 'moment';

export class DateOptions {
  public all: DateOption[];
  public anytime = new DateOption({
    fromDate: '00010101',
    toDate: '20991231',
    value: null,
    viewValue: 'Når som helst'
  });
  public twentyFirstCentury = new DateOption({
    fromDate: '20010101',
    toDate: '20991231',
    value: 'date:[20000101 TO 20991231]',
    viewValue: '2000-'
  });
  public twentiethCentury = new DateOption({
    fromDate: '19010101',
    toDate: '19991231',
    value: 'date:[19000101 TO 19991231]',
    viewValue: '1900-tallet'
  });
  public nineteenthCentury = new DateOption({
    fromDate: '18010101',
    toDate: '18991231',
    value: 'date:[18000101 TO 18991231]',
    viewValue: '1800-tallet'
  });
  public customDate = new DateOption({
    type: 'custom',
    value: 'select',
    viewValue: 'Egendefinert datoområde'
  });

  constructor() {
    this.all = [
      this.anytime,
      this.twentyFirstCentury,
      this.twentiethCentury,
      this.nineteenthCentury,
      this.customDate
    ];
  }
}

export class DateOption {
  type?: string;
  fromDate?: string;
  toDate?: string;
  value? = null;
  viewValue? = null;

  constructor(fields?: {
    type?: string;
    fromDate?: any;
    toDate?: any;
    value?: string;
    viewValue?: string;
  }) {
    if (fields) {
      this.type = fields.type || this.type;
      this.fromDate = fields.fromDate || this.fromDate;
      this.toDate = fields.toDate || this.toDate;
      this.value = fields.value || this.value;
      this.viewValue = fields.viewValue || this.viewValue;
    }
  }
}
