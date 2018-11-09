import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { PasswordValidation } from './password.validation';
import { AuthError, Authenticate } from '@nbdigi/data-models';

@Component({
  selector: 'nbd-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit, OnChanges {
  @Input() authError: AuthError;
  @Output() signUpSelected = new EventEmitter<Authenticate>();
  signUpForm: FormGroup;
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;

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
        } else if (curr.code === 'auth/weak-password') {
          this.password.setErrors({
            weakPassword: curr.message
          });
        }
      }
    }
  }

  createForm() {
    this.email = new FormControl();
    this.password = new FormControl('', Validators.required);
    this.confirmPassword = new FormControl('', Validators.required);
    this.signUpForm = this.fb.group(
      {
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  signUp(): void {
    this.signUpSelected.emit({
      email: this.signUpForm.get('email').value,
      password: this.signUpForm.get('password').value
    });
  }
}
