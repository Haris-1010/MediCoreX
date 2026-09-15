import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-insurance-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Insurance" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Insurance' }]"></app-page-header>

      <div class="insurance-container">
        <mat-card class="coming-soon-card">
          <mat-card-content>
            <mat-icon class="coming-soon-icon">health_and_safety</mat-icon>
            <h2>Insurance Module</h2>
            <p>Insurance claims management, policy verification, and provider integrations coming soon.</p>
            <div class="feature-list">
              <div class="feature-item">
                <mat-icon>verified_user</mat-icon>
                <span>Policy Verification</span>
              </div>
              <div class="feature-item">
                <mat-icon>assignment</mat-icon>
                <span>Claims Processing</span>
              </div>
              <div class="feature-item">
                <mat-icon>business</mat-icon>
                <span>Provider Management</span>
              </div>
              <div class="feature-item">
                <mat-icon>receipt</mat-icon>
                <span>Pre-Authorization</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .insurance-container { padding: 1.5rem; }
    .coming-soon-card { max-width: 600px; margin: 2rem auto; text-align: center; padding: 2rem; }
    .coming-soon-icon { font-size: 64px; width: 64px; height: 64px; color: #3f51b5; margin-bottom: 1rem; }
    .coming-soon-card h2 { margin: 0.5rem 0; color: #333; }
    .coming-soon-card p { color: #666; margin-bottom: 1.5rem; }
    .feature-list { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
    .feature-item {
      display: flex; align-items: center; gap: 0.5rem;
      background: #e8eaf6; padding: 0.5rem 1rem; border-radius: 8px;
      color: #3f51b5; font-size: 0.875rem; font-weight: 500;
    }
    .feature-item mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class InsuranceDashboardComponent {}
