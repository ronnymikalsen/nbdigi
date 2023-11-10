import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateOptions } from '../../../core/models';

@Component({
  selector: 'nbd-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss']
})
export class DatePickerDialogComponent implements OnInit {
  dateForm!: FormGroup;
  fromDate!: FormControl;
  toDate!: FormControl;

  constructor(
    public dialogRef: MatDialogRef<DatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<MomentDateAdapter>
  ) {
    this.createForm();
  }

  ngOnInit() {}

  onSubmit() {
    this.dialogRef.close({
      fromDate: this.fromDate.value,
      toDate: this.toDate.value
    });
  }

  private createForm() {
    if (this.data.item.type === new DateOptions().customDate.type) {
      if (this.data.item.fromDate) {
        const f = this.dateAdapter.parse(this.data.item.fromDate, 'YYYYMMDD');
        if (
          !this.dateAdapter.sameDate(this.dateAdapter.createDate(1, 0, 1), f)
        ) {
          this.fromDate = new FormControl(f);
        }
      }
      if (this.data.item.toDate) {
        const t = this.dateAdapter.parse(this.data.item.toDate, 'YYYYMMDD');
        if (!this.dateAdapter.sameDate(this.dateAdapter.today(), t)) {
          this.toDate = new FormControl(t);
        }
      }
    }

    if (!this.fromDate) {
      this.fromDate = new FormControl();
    }
    if (!this.toDate) {
      this.toDate = new FormControl();
    }

    this.dateForm = this.fb.group({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  fromDateParser(event: MatDatepickerInputEvent<Date>) {
    const value = (<HTMLInputElement>event.targetElement).value;
    const reg = new RegExp(/^\d{4}$/);
    if (reg.test(value)) {
      this.fromDate.patchValue(
        this.dateAdapter.createDate(parseInt(value, 10), 0, 1)
      );
    }
  }

  toDateParser(event: MatDatepickerInputEvent<Date>) {
    const value = (<HTMLInputElement>event.targetElement).value;
    const reg = new RegExp(/^\d{4}$/);
    if (reg.test(value)) {
      this.toDate.patchValue(
        this.dateAdapter.createDate(parseInt(value, 10), 11, 31)
      );
    }
  }
}
