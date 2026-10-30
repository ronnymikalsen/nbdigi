export class YearCount {
  year = '';
  count? = 0;

  constructor(fields?: { year: string; count?: number }) {
    if (fields) {
      this.year = fields.year || this.year;
      this.count = fields.count || this.count;
    }
  }
}
