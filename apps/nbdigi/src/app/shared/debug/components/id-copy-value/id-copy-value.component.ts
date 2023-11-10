import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'nbd-id-copy-value',
  templateUrl: './id-copy-value.component.html',
  styleUrls: ['./id-copy-value.component.scss'],
})
export class IdCopyValueComponent implements OnInit {
  @Input() label!: string;
  @Input() value!: string | null;

  constructor(public snackBar: MatSnackBar) {}

  ngOnInit() {}

  cbOnSuccess(value: string) {
    this.snackBar.open(`${value} er kopiert til utklippstavlen`, '', {
      duration: 2000,
    });
  }
}
