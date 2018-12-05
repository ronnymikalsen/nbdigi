export class ChartOption {
  selection?: string;
  value?: string;
  year?: string;
  viewValue? = '';

  constructor(fields?: {
    selection?: string;
    value?: any;
    year?: string;
    viewValue?: string;
  }) {
    if (fields) {
      this.selection = fields.selection || this.selection;
      this.value = fields.value || this.value;
      this.year = fields.year || this.year;
      this.viewValue = fields.viewValue || this.viewValue;
    }
  }
}
