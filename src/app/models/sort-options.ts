export class SortOptions {
  public all: Sort[];
  public relevance = new Sort({ value: '_score,desc', viewValue: 'Relevans' });
  public titleAsc = new Sort({ value: 'title,asc', viewValue: 'Tittel A-Å' });
  public titleDesc = new Sort({ value: 'title,desc', viewValue: 'Tittel Å-A' });
  public dateAsc = new Sort({ value: 'date,asc', viewValue: 'Eldste først' });
  public dateDesc = new Sort({ value: 'date,desc', viewValue: 'Nyeste først' });
  public newArrivals = new Sort({
    value: 'firstDigitalContentTime,desc',
    viewValue: 'Nyankommet'
  });

  constructor() {
    this.all = [
      this.relevance,
      this.titleAsc,
      this.titleDesc,
      this.dateAsc,
      this.dateDesc,
      this.newArrivals
    ];
  }
}

export class Sort {
  value? = null;
  viewValue? = null;

  constructor(fields?: { value?: string; viewValue?: string }) {
    if (fields) {
      this.value = fields.value || this.value;
      this.viewValue = fields.viewValue || this.viewValue;
    }
  }
}
