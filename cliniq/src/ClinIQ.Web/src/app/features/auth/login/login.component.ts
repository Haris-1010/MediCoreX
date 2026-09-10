import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-login',
  template: `
    <div class="login-card">
      <h2>Welcome Back</h2>
      <p class="subtitle">Sign in to your account</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter your email">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="showTenantCode">
          <mat-label>Tenant Code</mat-label>
          <input matInput formControlName="tenantCode" placeholder="Enter tenant code">
          <mat-icon matPrefix>business</mat-icon>
        </mat-form-field>

        <div class="form-actions">
          <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
          <a routerLink="/auth/forgot-password">Forgot password?</a>
        </div>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="loginForm.invalid || isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          <span *ngIf="!isLoading">Sign In</span>
        </button>
      </form>

      <div class="register-link">
        Don't have an account? <a routerLink="/auth/register">Sign up</a>
      </div>
    </div>
  `,
  styles: [`
    .login-card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
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

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .form-actions a {
      color: #3f51b5;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .submit-btn {
      height: 48px;
      font-size: 1rem;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
    }

    .register-link a {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  showTenantCode = false;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      tenantCode: [''],
      rememberMe: [false]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }, true).subscribe({
      next: () => {
        this.notification.success('Welcome back!');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error(error.error?.message || error.message || 'Unable to sign in.');
        if (error.status === 400 && error.error?.requiresTenantCode) {
          this.showTenantCode = true;
          this.notification.info('Please enter your tenant code');
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
