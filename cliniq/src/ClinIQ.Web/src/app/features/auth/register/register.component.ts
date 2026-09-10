import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-register',
  template: `
    <div class="register-card">
      <h2>Create Account</h2>
      <p class="subtitle">Sign up to get started</p>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
            <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
            <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">Required</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email format</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Organization Name</mat-label>
          <input matInput formControlName="organizationName">
          <mat-icon matPrefix>business</mat-icon>
          <mat-hint>Enter your organization/hospital name</mat-hint>
          <mat-error *ngIf="registerForm.get('organizationName')?.hasError('required')">Organization name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
          <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Minimum 8 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword = !hideConfirmPassword">
            <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">Please confirm password</mat-error>
          <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">Passwords don't match</mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="agreeToTerms" class="terms-checkbox">
          I agree to the <a href="/terms" target="_blank">Terms of Service</a>
          and <a href="/privacy" target="_blank">Privacy Policy</a>
        </mat-checkbox>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="registerForm.invalid || isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          <span *ngIf="!isLoading">Create Account</span>
        </button>
      </form>

      <div class="login-link">
        Already have an account? <a routerLink="/auth/login">Sign in</a>
      </div>
    </div>
  `,
  styles: [`
    .register-card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
    }

    h2 {
      margin: 0 0 0.5rem;
      font-size: 1.75rem;
      font-weight: 600;
      text-align: center;
    }

    .subtitle {
      color: #666;
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .terms-checkbox {
      margin-bottom: 1.5rem;
    }

    .terms-checkbox a {
      color: #3f51b5;
    }

    .submit-btn {
      height: 48px;
      font-size: 1rem;
    }

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
    }

    .login-link a {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      organizationName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.notification.success('Account created successfully! Please sign in.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
