import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-favorite-list',
  templateUrl: './create-favorite-list.component.html',
  styleUrls: ['./create-favorite-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFavoriteListComponent implements OnInit, AfterViewInit {
  @ViewChild('listname') listNameEl: ElementRef;
  @Output() cancelSelected = new EventEmitter<void>();
  @Output() listNameSelected = new EventEmitter<string>();
  listForm: FormGroup;
  listName: FormControl;

  constructor(public snackBar: MatSnackBar, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.listName = new FormControl();
    this.listForm = this.fb.group({
      listName: this.listName
    });
  }

  addList(event: MouseEvent) {
    event.preventDefault();
    this.listNameSelected.emit(this.listName.value);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.listNameEl.nativeElement.focus();
    }, 10);
  }
}
