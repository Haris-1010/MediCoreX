import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-platform-login',
  template: `
    <div class="platform-login">
      <div class="login-panel">
        <div class="brand"><mat-icon>admin_panel_settings</mat-icon><span>MediCoreX Platform</span></div>
        <h1>Platform Admin</h1>
        <p class="muted">Sign in with your platform administrator account to manage organizations.</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Admin email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="username">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password">
          </mat-form-field>
          <button mat-raised-button color="primary" class="full-width" [disabled]="form.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Sign in to platform</span>
          </button>
        </form>
        <a routerLink="/auth/login" class="back-link">Back to clinic login</a>
      </div>
    </div>
  `,
  styles: [`
    .platform-login { min-height: 100vh; display: grid; place-items: center; background: var(--bg-primary, #101827); padding: 24px; }
    .login-panel { width: min(430px, 100%); background: var(--bg-card, white); padding: 36px; border-radius: 12px; box-shadow: var(--shadow-md, 0 18px 50px rgba(0,0,0,.28)); }
    .brand { display: flex; align-items: center; gap: 10px; color: var(--accent-primary, #1f5f63); font-weight: 700; letter-spacing: .02em; }
    .brand mat-icon { color: var(--warning, #d97706); }
    h1 { margin: 28px 0 8px; color: var(--text-primary, #172033); }
    .muted { color: var(--text-muted, #64748b); line-height: 1.5; margin-bottom: 28px; }
    .full-width { width: 100%; margin-bottom: 12px; }
    button { min-height: 46px; }
    mat-spinner { margin: auto; }
    .back-link { display: block; margin-top: 18px; text-align: center; color: var(--accent-primary, #1f5f63); text-decoration: none; }
  `]
})
export class PlatformLoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value, true).subscribe({
      next: response => {
        this.loading = false;
        if (!response.user.isSuperAdmin) {
          this.auth.logout();
          this.notification.error('This account is not a platform administrator.');
          return;
        }
        this.notification.success('Platform login successful.');
        this.router.navigate(['/platform/organizations']);
      },
      error: () => {
        this.loading = false;
        this.notification.error('Invalid platform administrator credentials.');
      }
    });
  }
}
