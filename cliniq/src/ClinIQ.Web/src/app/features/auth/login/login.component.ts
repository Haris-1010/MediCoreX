import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
@Component({
  standalone: false,
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-header">
        <div class="login-avatar">
          <mat-icon>local_hospital</mat-icon>
        </div>
        <h2>Welcome Back</h2>
        <p class="subtitle">Sign in to your account to continue</p>
      </div>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email Address</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter your email">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
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
          <div class="btn-content" *ngIf="!isLoading">
            <mat-icon>login</mat-icon>
            <span>Sign In</span>
          </div>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 420px;
    }
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .login-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
      border-radius: 16px;
      margin-bottom: 1rem;
    }
    .login-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1a237e;
    }
    .login-header h2 {
      margin: 0 0 0.5rem;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a237e;
    }
    .subtitle {
      color: #64748b;
      margin: 0;
      font-size: 0.95rem;
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
      font-weight: 500;
    }
    .form-actions a:hover {
      text-decoration: underline;
    }
    .submit-btn {
      height: 52px;
      font-size: 1rem;
      font-weight: 600;
    }
    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
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
