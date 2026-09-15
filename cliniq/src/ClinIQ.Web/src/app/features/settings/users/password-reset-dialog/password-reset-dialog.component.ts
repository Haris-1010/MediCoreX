import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface PasswordResetDialogData {
  userId: string;
  userName: string;
  currentPassword: string;
}

@Component({
  standalone: true,
  selector: 'app-password-reset-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Reset Password</h2>
    <mat-dialog-content>
      <p class="user-info">Setting new password for: <strong>{{ data.userName }}</strong></p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Current Password</mat-label>
        <input matInput [type]="showCurrentPassword ? 'text' : 'password'" [value]="data.currentPassword" readonly>
        <button mat-icon-button matSuffix (click)="showCurrentPassword = !showCurrentPassword" type="button">
          <mat-icon>{{ showCurrentPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        <mat-hint>This is the current default password</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>New Password</mat-label>
        <input matInput [type]="showNewPassword ? 'text' : 'password'" [(ngModel)]="newPassword" placeholder="Enter new password">
        <button mat-icon-button matSuffix (click)="showNewPassword = !showNewPassword" type="button">
          <mat-icon>{{ showNewPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        <mat-hint>Enter a strong password (min 6 characters)</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Confirm New Password</mat-label>
        <input matInput [type]="showConfirmPassword ? 'text' : 'password'" [(ngModel)]="confirmPassword" placeholder="Confirm new password">
        <button mat-icon-button matSuffix (click)="showConfirmPassword = !showConfirmPassword" type="button">
          <mat-icon>{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        <mat-error *ngIf="confirmPassword && newPassword !== confirmPassword">Passwords do not match</mat-error>
      </mat-form-field>

      <div class="password-requirements">
        <p><strong>Password Requirements:</strong></p>
        <ul>
          <li [class.valid]="newPassword.length >= 6">At least 6 characters</li>
          <li [class.valid]="newPassword !== confirmPassword && confirmPassword">Passwords match</li>
        </ul>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="resetPassword()" [disabled]="!isValid()">
        <mat-icon>key</mat-icon>
        Reset Password
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-info {
      margin-bottom: 1rem;
      color: #333;
    }

    .full-width {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .password-requirements {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .password-requirements p {
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
      color: #333;
    }

    .password-requirements ul {
      margin: 0;
      padding-left: 1.25rem;
    }

    .password-requirements li {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .password-requirements li.valid {
      color: #2e7d32;
    }

    mat-dialog-content {
      min-width: 350px;
    }
  `]
})
export class PasswordResetDialogComponent {
  newPassword = '';
  confirmPassword = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    public dialogRef: MatDialogRef<PasswordResetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PasswordResetDialogData
  ) {}

  isValid(): boolean {
    return this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
  }

  resetPassword(): void {
    if (this.isValid()) {
      this.dialogRef.close({ newPassword: this.newPassword });
    }
  }
}