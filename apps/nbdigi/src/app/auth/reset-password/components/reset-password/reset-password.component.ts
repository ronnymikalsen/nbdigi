import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthError } from '../../../../core/models';

@Component({
  selector: 'nbd-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnChanges {
  @Input() authError: AuthError;
  @Output() resetEmail = new EventEmitter<string>();
  resetPasswordForm: FormGroup;
  email: FormControl;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['authError']) {
      const curr = changes['authError'].currentValue;
      if (curr) {
        if (curr.code === 'auth/email-already-in-use') {
          this.email.setErrors({
            emailAlreadyInUse: curr.message
          });
        } else if (curr.code === 'auth/invalid-email') {
          this.email.setErrors({
            invalidEmail: curr.message
          });
        } else if (curr.code === 'auth/user-not-found') {
          this.email.setErrors({
            userNotFound: curr.message
          });
        }
      }
    }
  }

  createForm() {
    this.email = new FormControl();
    this.resetPasswordForm = this.fb.group({
      email: this.email
    });
  }

  resetPassword(): void {
    this.resetEmail.emit(this.resetPasswordForm.get('email').value);
  }
}
