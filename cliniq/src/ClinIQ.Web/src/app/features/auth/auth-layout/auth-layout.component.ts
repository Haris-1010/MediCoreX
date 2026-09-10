import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-auth-layout',
  template: `
    <div class="auth-layout">
      <div class="auth-sidebar">
        <div class="sidebar-content">
          <h1>MediCoreX</h1>
          <p>Complete Clinic & Hospital Management Solution</p>
          <ul class="features">
            <li><mat-icon>check_circle</mat-icon> Patient Management</li>
            <li><mat-icon>check_circle</mat-icon> Appointment Scheduling</li>
            <li><mat-icon>check_circle</mat-icon> Electronic Medical Records</li>
            <li><mat-icon>check_circle</mat-icon> Billing & Invoicing</li>
            <li><mat-icon>check_circle</mat-icon> Inventory Management</li>
            <li><mat-icon>check_circle</mat-icon> Real-time Analytics</li>
          </ul>
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
    }

    .auth-sidebar {
      flex: 0 0 40%;
      background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .sidebar-content {
      max-width: 400px;
    }

    .sidebar-content h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .sidebar-content p {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .features {
      list-style: none;
      padding: 0;
    }

    .features li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      font-size: 1rem;
      opacity: 0.9;
    }

    .features mat-icon {
      color: #00bcd4;
    }

    .auth-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f5f5f5;
    }

    @media (max-width: 992px) {
      .auth-sidebar {
        display: none;
      }
    }
  `]
})
export class AuthLayoutComponent {}
