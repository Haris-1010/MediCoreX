import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-master-login',
  template: `
    <div class="master-login">
      <aside class="brand-panel">
        <div class="brand-inner">
          <div class="brand-mark">
            <mat-icon>workspace_premium</mat-icon>
          </div>
          <p class="eyebrow">ClinIQ Control</p>
          <h1>Master Portal</h1>
          <p class="lede">
            Exclusive owner access. Pause or resume the entire platform —
            every organization and platform admin — in one action.
          </p>
          <ul class="perks">
            <li><mat-icon>verified_user</mat-icon> Single owner account only</li>
            <li><mat-icon>power_settings_new</mat-icon> Global system kill switch</li>
            <li><mat-icon>visibility</mat-icon> Full platform oversight</li>
          </ul>
        </div>
        <div class="brand-foot">Authorized personnel only</div>
      </aside>

      <main class="form-side">
        <div class="form-card">
          <div class="card-head">
            <span class="secure-chip"><mat-icon>lock</mat-icon> Secure sign-in</span>
            <h2>Welcome back</h2>
            <p>Sign in with the designated master account.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Master email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="username">
              <mat-icon matPrefix>mail</mat-icon>
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'password'"
                     formControlName="password" autocomplete="current-password">
              <mat-icon matPrefix>key</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword"
                      [attr.aria-label]="hidePassword ? 'Show password' : 'Hide password'">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" class="submit-btn full-width"
                    [disabled]="form.invalid || loading">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Sign in as master</span>
            </button>
          </form>

          <a routerLink="/auth/login" class="back-link">
            <mat-icon>arrow_back</mat-icon>
            Back to regular login
          </a>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .master-login {
      min-height: 100vh;
      display: grid;
      grid-template-columns: minmax(300px, 460px) 1fr;
      background: #f4f6fb;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .brand-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 44px;
      background:
        radial-gradient(circle at 20% 15%, rgba(240, 179, 91, .28), transparent 45%),
        radial-gradient(circle at 80% 85%, rgba(56, 120, 255, .14), transparent 40%),
        linear-gradient(160deg, #eef2ff 0%, #f8fafc 55%, #fff7ed 100%);
      border-right: 1px solid #e2e8f0;
      overflow: hidden;
    }

    .brand-panel::after {
      content: '';
      position: absolute;
      inset: auto -20% -30% auto;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      border: 1px solid rgba(217, 119, 6, .22);
      pointer-events: none;
    }

    .brand-inner { position: relative; z-index: 1; }

    .brand-mark {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: #fff7ed;
      border: 1px solid #fdba74;
      color: #c2410c;
      box-shadow: 0 8px 20px rgba(234, 88, 12, .12);
      margin-bottom: 28px;
    }
    .brand-mark mat-icon { font-size: 28px; width: 28px; height: 28px; }

    .eyebrow {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: #c2410c;
    }

    h1 {
      margin: 0 0 14px;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -.02em;
    }

    .lede {
      margin: 0 0 32px;
      color: #475569;
      line-height: 1.65;
      font-size: 15px;
      max-width: 34ch;
    }

    .perks {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 14px;
    }
    .perks li {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #334155;
      font-size: 14px;
      font-weight: 500;
    }
    .perks mat-icon {
      color: #c2410c;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .brand-foot {
      position: relative;
      z-index: 1;
      font-size: 12px;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #94a3b8;
    }

    .form-side {
      display: grid;
      place-items: center;
      padding: 32px 24px;
      background:
        radial-gradient(circle at 70% 20%, rgba(240, 179, 91, .12), transparent 40%),
        #f4f6fb;
    }

    .form-card {
      width: min(420px, 100%);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 36px 34px 28px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, .08);
    }

    .card-head { margin-bottom: 26px; }

    .secure-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 11px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: #15803d;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      margin-bottom: 16px;
    }
    .secure-chip mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .card-head h2 {
      margin: 0 0 8px;
      font-size: 26px;
      font-weight: 750;
      color: #0f172a;
      letter-spacing: -.02em;
    }
    .card-head p { margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; }

    .full-width { width: 100%; }
    form { display: grid; gap: 4px; }

    ::ng-deep .mat-mdc-form-field {
      --mdc-filled-text-field-container-color: #f8fafc;
      --mdc-filled-text-field-label-text-color: #64748b;
      --mdc-filled-text-field-input-text-color: #0f172a;
      --mdc-filled-text-field-outline-color: #cbd5e1;
      --mdc-filled-text-field-hover-outline-color: #94a3b8;
      --mdc-filled-text-field-focus-outline-color: #ea580c;
      --mdc-filled-text-field-label-text-size: 13px;
      --mdc-filled-text-field-input-text-size: 15px;
    }
    ::ng-deep .mat-mdc-form-field.mat-focused {
      --mdc-filled-text-field-outline-color: #ea580c;
    }
    ::ng-deep .mat-mdc-text-field-wrapper { padding-top: 4px; }
    ::ng-deep .mat-mdc-form-field infix { color: #94a3b8; }

    .submit-btn {
      min-height: 48px;
      margin-top: 10px;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: .02em;
      background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%) !important;
      color: #fff !important;
      border: none;
      box-shadow: 0 10px 22px rgba(234, 88, 12, .22);
    }
    .submit-btn[disabled] { opacity: .6; box-shadow: none; }
    .submit-btn mat-spinner { display: inline-block; }

    .back-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 22px;
      padding-top: 18px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 500;
      transition: color .15s ease;
    }
    .back-link:hover { color: #ea580c; }
    .back-link mat-icon { font-size: 16px; width: 16px; height: 16px; }

    @media (max-width: 900px) {
      .master-login { grid-template-columns: 1fr; }
      .brand-panel { display: none; }
      .form-side { min-height: 100vh; }
    }
  `]
})
export class MasterLoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  hidePassword = true;

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
        if (!response.user.isMaster) {
          this.auth.logout();
          this.notification.error('This account is not the master owner.');
          return;
        }
        this.notification.success('Master login successful.');
        this.router.navigate(['/master/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.notification.error('Invalid master credentials.');
      }
    });
  }
}
