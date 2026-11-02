import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthError, Authenticate } from '../../../core/models';

@Component({
  selector: 'nbd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoginComponent implements OnChanges {
  @Input() authError: AuthError | null | undefined = null;
  @Output() signInWithGoogleSelected = new EventEmitter<void>();
  @Output()
  signInWithEmailAndPasswordSelected = new EventEmitter<Authenticate>();
  loginForm!: FormGroup;
  email!: FormControl;
  password!: FormControl;
  hidePassword = true;
  formError = '';

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['authError']) {
      this.formError = '';
      const curr = changes['authError'].currentValue;
      if (curr) {
        if (curr.code === 'auth/wrong-password') {
          this.password.setErrors({
            wrongPassword: curr.message,
          });
        } else if (curr.code === 'auth/user-not-found') {
          this.email.setErrors({
            userNotFound: curr.message,
          });
        } else if (curr.code === 'auth/invalid-email') {
          this.email.setErrors({
            invalidEmail: curr.message,
          });
        } else if (curr.code === 'auth/too-many-requests') {
          this.formError = 'For mange innloggingsforsøk. Prøv igjen senere.';
        } else if (curr.code === 'auth/invalid-credential') {
          this.formError = 'E-post eller passord er feil. Prøv igjen.';
        } else if (curr.code === 'auth/network-request-failed') {
          this.formError =
            'Kunne ikke koble til. Sjekk internettilkoblingen og prøv igjen.';
        } else if (curr.code !== 'auth/popup-closed-by-user') {
          this.formError = 'Kunne ikke logge inn. Prøv igjen.';
        }
      }
    }
  }

  createForm() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', Validators.required);
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
  }

  signInWithGoogle(): void {
    this.signInWithGoogleSelected.emit();
  }

  signInWithEmailAndPassword(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.signInWithEmailAndPasswordSelected.emit({
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    });
  }
}
