import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-print-brand-header',
  imports: [CommonModule],
  template: `
    <div class="brand-header" *ngIf="logoUrl || orgName">
      <div class="brand-left">
        <h1 class="org-name">{{ orgName || 'Organization Name' }}</h1>
        <div class="contact-row">
          <div class="contact-item" *ngIf="phone">
            <span class="contact-label">Phone:</span>
            <span class="contact-value">{{ phone }}</span>
          </div>
          <div class="contact-item" *ngIf="address">
            <span class="contact-label">Address:</span>
            <span class="contact-value">{{ address }}</span>
          </div>
        </div>
      </div>
      <div class="brand-right">
        <img *ngIf="logoUrl" [src]="logoUrl" alt="Logo" class="brand-logo" />
      </div>
    </div>
  `,
  styles: [`
    .brand-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #1a237e;
    }
    .brand-left {
      flex: 1;
      min-width: 0;
    }
    .org-name {
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 800;
      color: #1a237e;
      line-height: 1.2;
    }
    .contact-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .contact-item {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .contact-label {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .contact-value {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    .brand-right {
      flex-shrink: 0;
      display: flex;
      align-items: flex-start;
    }
    .brand-logo {
      max-width: 120px;
      max-height: 120px;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    @media print {
      .brand-header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `]
})
export class PrintBrandHeaderComponent {
  @Input() logoUrl: string | null = null;
  @Input() orgName: string | null = null;
  @Input() phone: string | null = null;
  @Input() address: string | null = null;
}