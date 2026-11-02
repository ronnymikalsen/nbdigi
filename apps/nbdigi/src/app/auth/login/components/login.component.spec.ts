import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule,
        RouterModule,
      ],
      declarations: [LoginComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(MatIconRegistry).addSvgIconLiteral(
      'google',
      TestBed.inject(DomSanitizer).bypassSecurityTrustHtml(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>',
      ),
    );
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('offers labeled fields and password-manager autocomplete in a Material card', () => {
    expect(fixture.nativeElement.querySelector('mat-card')).not.toBeNull();
    const email = fixture.nativeElement.querySelector('input[type="email"]');
    const password = fixture.nativeElement.querySelector(
      'input[type="password"]',
    );
    expect(email.autocomplete).toBe('username');
    expect(password.autocomplete).toBe('current-password');
    expect(fixture.nativeElement.querySelectorAll('mat-label')).toHaveLength(2);
  });

  it('shows required-field errors rather than submitting an empty form', () => {
    const submit = jest.spyOn(
      component.signInWithEmailAndPasswordSelected,
      'emit',
    );
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(submit).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'Skriv inn e-postadressen din',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Skriv inn passordet ditt',
    );
  });

  it('rejects an invalid email address and submits valid credentials', () => {
    const submit = jest.spyOn(
      component.signInWithEmailAndPasswordSelected,
      'emit',
    );
    component.loginForm.setValue({
      email: 'not-an-email',
      password: 'password',
    });
    component.signInWithEmailAndPassword();
    expect(submit).not.toHaveBeenCalled();
    component.loginForm.setValue({
      email: 'reader@example.com',
      password: 'password',
    });
    component.signInWithEmailAndPassword();
    expect(submit).toHaveBeenCalledWith({
      email: 'reader@example.com',
      password: 'password',
    });
  });

  it('toggles password visibility without submitting the form', () => {
    const submit = jest.spyOn(
      component.signInWithEmailAndPasswordSelected,
      'emit',
    );
    const button = fixture.nativeElement.querySelector(
      'button[aria-label="Vis passord"]',
    );
    expect(button.type).toBe('button');
    button.click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('input[formControlName="password"]')
        .type,
    ).toBe('text');
    expect(button.getAttribute('aria-label')).toBe('Skjul passord');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(submit).not.toHaveBeenCalled();
  });

  it('keeps Google sign-in and account recovery routes available', () => {
    const google = jest.spyOn(component.signInWithGoogleSelected, 'emit');
    fixture.nativeElement.querySelector('.google-login-button').click();
    expect(google).toHaveBeenCalledTimes(1);
    expect(
      fixture.nativeElement.querySelector(
        'a[routerLink="/auth/resetpassword"]',
      ),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        'a[routerLink="/auth/createaccount"]',
      ),
    ).not.toBeNull();
  });

  it('announces authentication errors and clears them when the error is reset', () => {
    fixture.componentRef.setInput('authError', {
      code: 'auth/invalid-credential',
      message: 'Invalid credentials',
    });
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('E-post eller passord er feil');
    fixture.componentRef.setInput('authError', null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
