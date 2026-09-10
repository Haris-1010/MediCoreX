import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-forgot-password',
  template: `
    <div class="forgot-card">
      <h2>Forgot Password</h2>
      <p class="subtitle">Enter your email to reset your password</p>

      <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" *ngIf="!emailSent">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter your email">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="forgotForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="forgotForm.get('email')?.hasError('email')">Invalid email format</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="forgotForm.invalid || isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          <span *ngIf="!isLoading">Send Reset Link</span>
        </button>
      </form>

      <div class="success-message" *ngIf="emailSent">
        <mat-icon>check_circle</mat-icon>
        <h3>Check your email</h3>
        <p>We've sent a password reset link to <strong>{{ email }}</strong></p>
        <button mat-stroked-button color="primary" (click)="emailSent = false">
          Try another email
        </button>
      </div>

      <div class="back-link">
        <a routerLink="/auth/login">
          <mat-icon>arrow_back</mat-icon>
          Back to sign in
        </a>
      </div>
    </div>
  `,
  styles: [`
    .forgot-card {
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

    .submit-btn {
      height: 48px;
      font-size: 1rem;
    }

    .success-message {
      text-align: center;
      padding: 1rem;
    }

    .success-message mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #4caf50;
    }

    .success-message h3 {
      margin: 1rem 0 0.5rem;
    }

    .success-message p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .back-link {
      text-align: center;
      margin-top: 1.5rem;
    }

    .back-link a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #3f51b5;
      text-decoration: none;
    }

    .back-link mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;
  emailSent = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.email = this.forgotForm.value.email;

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.emailSent = true;
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
