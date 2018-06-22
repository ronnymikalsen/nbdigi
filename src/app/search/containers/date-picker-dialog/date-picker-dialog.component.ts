import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss']
})
export class DatePickerDialogComponent implements OnInit {
  dateForm: FormGroup;
  fromDate = new FormControl();
  toDate = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<DatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
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
    this.dateForm = this.fb.group({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }
}
