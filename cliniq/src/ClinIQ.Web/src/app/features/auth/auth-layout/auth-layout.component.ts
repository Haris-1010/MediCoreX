import { Component } from '@angular/core';
@Component({
  standalone: false,
  selector: 'app-auth-layout',
  template: `
    <div class="auth-layout">
      <div class="auth-sidebar">
        <div class="sidebar-content">
          <div class="branding">
            <div class="logo-wrapper">
              <mat-icon class="logo-icon">local_hospital</mat-icon>
            </div>
            <h1>MediCoreX</h1>
            <p>Complete Clinic &amp; Hospital Management Solution</p>
          </div>
          <ul class="features">
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Patient Management</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Appointment Scheduling</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Electronic Medical Records</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Billing &amp; Invoicing</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Inventory Management</span>
            </li>
            <li>
              <mat-icon>check_circle</mat-icon>
              <span>Real-time Analytics</span>
            </li>
          </ul>
          <div class="decorative-pattern">
            <div class="pattern-item" *ngFor="let i of patternDots"></div>
          </div>
        </div>
      </div>
      <div class="auth-main">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      display: flex;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .auth-sidebar {
      flex: 0 0 45%;
      background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    .auth-sidebar::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
      transform: rotate(25deg);
    }
    .sidebar-content {
      max-width: 420px;
      width: 100%;
      position: relative;
      z-index: 1;
    }
    .branding {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .logo-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      margin-bottom: 1rem;
    }
    .logo-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #00bcd4;
    }
    .branding h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 0.5rem;
    }
    .branding p {
      font-size: 1.1rem;
      opacity: 0.85;
      font-weight: 400;
    }
    .features {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }
    .features li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0;
      font-size: 1rem;
      opacity: 0.9;
      transition: opacity 0.2s ease;
    }
    .features li:hover {
      opacity: 1;
    }
    .features mat-icon {
      color: #00bcd4;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .decorative-pattern {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      opacity: 0.3;
    }
    .pattern-item {
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
    }
    .auth-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f8f9fa;
    }
    @media (max-width: 992px) {
      .auth-sidebar {
        display: none;
      }
      .auth-layout {
        justify-content: center;
      }
    }
  `]
})
export class AuthLayoutComponent {
  patternDots = new Array(24);
}
