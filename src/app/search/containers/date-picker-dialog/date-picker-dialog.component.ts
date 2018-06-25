import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, DateAdapter } from '@angular/material';
import { DateOptions } from '../../../models/date-options';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
@Component({
  selector: 'app-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss']
})
export class DatePickerDialogComponent implements OnInit {
  dateForm: FormGroup;
  fromDate: FormControl;
  toDate: FormControl;

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
}
