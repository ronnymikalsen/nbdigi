export class DateOptions {
  public all: DateOption[];
  public anytime = new DateOption({
    value: null,
    viewValue: 'Når som helst'
  });
  public twentyFirstCentury = new DateOption({
    value: 'date:[20000101 TO 20991231]',
    viewValue: '2000-'
  });
  public twentiethCentury = new DateOption({
    value: 'date:[19000101 TO 19991231]',
    viewValue: '1900-tallet'
  });
  public nineteenthCentury = new DateOption({
    value: 'date:[18000101 TO 18991231]',
    viewValue: '1800-tallet'
  });
  public customDate = new DateOption({
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
  value? = null;
  viewValue? = null;

  constructor(fields?: { value?: string; viewValue?: string }) {
    if (fields) {
      this.value = fields.value || this.value;
      this.viewValue = fields.viewValue || this.viewValue;
    }
  }
}
