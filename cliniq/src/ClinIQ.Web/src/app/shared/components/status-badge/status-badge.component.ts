import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-status-badge',
  template: `
    <span class="badge" [ngClass]="badgeClass">
      {{ displayText }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .badge-success {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge-warning {
      background: var(--status-warning-bg, #fff3e0);
      color: #ef6c00;
    }

    .badge-danger {
      background: #ffebee;
      color: #c62828;
    }

    .badge-info {
      background: #e3f2fd;
      color: #1565c0;
    }

    .badge-secondary {
      background: var(--bg-hover, #f5f5f5);
      color: var(--text-muted, #666);
    }

    .badge-primary {
      background: #e8eaf6;
      color: #3f51b5;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status!: string;
  @Input() customText?: string;
  @Input() customClass?: string;

  private statusMap: { [key: string]: { class: string; text?: string } } = {
    // Common statuses
    'active': { class: 'badge-success' },
    'inactive': { class: 'badge-secondary' },
    'pending': { class: 'badge-warning' },
    'completed': { class: 'badge-success' },
    'cancelled': { class: 'badge-danger' },
    'draft': { class: 'badge-secondary' },

    // Appointment statuses
    'scheduled': { class: 'badge-info' },
    'confirmed': { class: 'badge-primary' },
    'checkedin': { class: 'badge-info', text: 'Checked In' },
    'inprogress': { class: 'badge-warning', text: 'In Progress' },
    'noshow': { class: 'badge-danger', text: 'No Show' },

    // Admission statuses
    'admitted': { class: 'badge-info' },
    'discharged': { class: 'badge-success' },
    'transferred': { class: 'badge-warning' },

    // Invoice statuses
    'paid': { class: 'badge-success' },
    'unpaid': { class: 'badge-danger' },
    'partiallypaid': { class: 'badge-warning', text: 'Partially Paid' },
    'overdue': { class: 'badge-danger' },
    'refunded': { class: 'badge-secondary' },

    // Bed statuses
    'available': { class: 'badge-success' },
    'occupied': { class: 'badge-danger' },
    'reserved': { class: 'badge-warning' },
    'maintenance': { class: 'badge-secondary' },
    'cleaning': { class: 'badge-info' },

    // Order statuses
    'ordered': { class: 'badge-info' },
    'processing': { class: 'badge-warning' },
    'shipped': { class: 'badge-info' },
    'delivered': { class: 'badge-success' },
    'returned': { class: 'badge-danger' },

    // Priority
    'low': { class: 'badge-secondary' },
    'normal': { class: 'badge-info' },
    'high': { class: 'badge-warning' },
    'urgent': { class: 'badge-danger' },
    'critical': { class: 'badge-danger' },
    'stat': { class: 'badge-danger' },
    'routine': { class: 'badge-info' },

    // Laboratory statuses
    'samplepending': { class: 'badge-warning', text: 'Sample Pending' },
    'samplecollected': { class: 'badge-info', text: 'Sample Collected' },
    'resultentered': { class: 'badge-primary', text: 'Result Entered' },
    'verified': { class: 'badge-success' },

    // Radiology statuses
    'patientarrived': { class: 'badge-info', text: 'Patient Arrived' },
    'procedureinprogress': { class: 'badge-warning', text: 'Procedure In Progress' },
    'imagingcompleted': { class: 'badge-primary', text: 'Imaging Completed' },
    'reportpending': { class: 'badge-warning', text: 'Report Pending' },
    'reportdrafted': { class: 'badge-primary', text: 'Report Drafted' }
  };

  get badgeClass(): string {
    if (this.customClass) {
      return this.customClass;
    }
    const normalizedStatus = this.status?.toLowerCase().replace(/[_\s-]/g, '');
    return this.statusMap[normalizedStatus]?.class || 'badge-secondary';
  }

  get displayText(): string {
    if (this.customText) {
      return this.customText;
    }
    const normalizedStatus = this.status?.toLowerCase().replace(/[_\s-]/g, '');
    return this.statusMap[normalizedStatus]?.text || this.status;
  }
}
