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
import { Authenticate, AuthError } from '../../../core/models';

@Component({
  selector: 'nbd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {
  @Input() authError: AuthError;
  @Output() signInWithGoogleSelected = new EventEmitter<void>();
  @Output()
  signInWithEmailAndPasswordSelected = new EventEmitter<Authenticate>();
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['authError']) {
      const curr = changes['authError'].currentValue;
      if (curr) {
        if (curr.code === 'auth/wrong-password') {
          this.password.setErrors({
            wrongPassword: curr.message
          });
        } else if (curr.code === 'auth/user-not-found') {
          this.email.setErrors({
            userNotFound: curr.message
          });
        } else if (curr.code === 'auth/invalid-email') {
          this.email.setErrors({
            invalidEmail: curr.message
          });
        } else if (curr.code === 'auth/too-many-requests') {
          this.loginForm.setErrors({
            tooManyRequests: curr.message
          });
        }
      }
    }
  }

  createForm() {
    this.email = new FormControl();
    this.password = new FormControl();
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    });
  }

  signInWithGoogle(): void {
    this.signInWithGoogleSelected.emit();
  }

  signInWithEmailAndPassword(): void {
    this.signInWithEmailAndPasswordSelected.emit({
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    });
  }
}
