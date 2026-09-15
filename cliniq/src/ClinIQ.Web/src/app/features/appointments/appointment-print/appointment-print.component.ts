import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { TenantService, Tenant } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-appointment-print',
  templateUrl: './appointment-print.component.html',
  styles: [`
    :host { display: block; background: white; color: #111; font-family: 'Segoe UI', Arial, sans-serif; }
    .print-sheet { max-width: 760px; margin: 0 auto; padding: 28px 36px; }
    .sheet-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #102b35; padding-bottom: 14px; margin-bottom: 18px; }
    .brand { font-size: 20px; font-weight: 800; color: #102b35; }
    .brand .brand-line { display: flex; align-items: center; gap: 8px; }
    .brand .brand-logo { max-width: 40px; max-height: 40px; border-radius: 6px; object-fit: contain; }
    .brand small { display: block; font-size: 11px; color: #64748b; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; }
    .doc-title { text-align: right; }
    .doc-title h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: .04em; color: #102b35; }
    .doc-title p { margin: 2px 0 0; font-size: 11px; color: #64748b; }

    .slip { border: 1px solid #dce5e5; border-radius: 10px; padding: 18px 20px; margin-bottom: 18px; }
    .slip-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px dashed #e2e8e8; font-size: 14px; }
    .slip-row:last-child { border-bottom: none; }
    .slip-row label { color: #64748b; font-weight: 500; }
    .slip-row span { font-weight: 600; text-align: right; }

    .status-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .status-chip { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
    .status-chip.scheduled { background: #eef2ff; color: #4338ca; }
    .status-chip.confirmed { background: #e5f6ec; color: #18794e; }
    .status-chip.checkedin { background: #fff7e6; color: #b54708; }
    .status-chip.completed { background: #e6f2fa; color: #0369a1; }
    .status-chip.cancelled { background: #fdecea; color: #b42318; }

    section { margin-bottom: 16px; }
    section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; color: #102b35; border-bottom: 1px solid #dce5e5; padding-bottom: 6px; margin: 0 0 10px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 20px; }
    .field label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
    .field span { font-size: 14px; font-weight: 600; }

    .note { background: #fafcfc; border: 1px solid #e7eeee; border-radius: 8px; padding: 10px 14px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
    .note.empty { color: #94a3b8; font-style: italic; }

    .doctor-space .writing-area { height: 320px; border: 1px dashed #c7d2d2; border-radius: 8px; background: repeating-linear-gradient(to bottom, #fff 0px, #fff 27px, #e8efef 28px); }

    .foot { margin-top: 26px; border-top: 1px solid #dce5e5; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }

    .no-print { position: fixed; top: 14px; right: 14px; z-index: 10; display: flex; gap: 8px; }
    @media print {
      .no-print { display: none !important; }
      :host { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-sheet { max-width: none; padding: 0; }
    }
  `]
})
export class AppointmentPrintComponent implements OnInit {
  appointment: any = null;
  branding: Tenant | null = null;
  loading = true;
  issuedAt: Date = new Date();
  currencySymbol = '$';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tenantService: TenantService
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById<any>('v1/appointments', id).subscribe({
        next: appointment => {
          this.appointment = appointment;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  get statusClass(): string {
    const s = (this.appointment?.status || '').toLowerCase().replace(/[\s_-]/g, '');
    const map: Record<string, string> = {
      scheduled: 'scheduled', confirmed: 'confirmed', checkedin: 'checkedin',
      checkin: 'checkedin', completed: 'completed', cancelled: 'cancelled', canceled: 'cancelled'
    };
    return map[s] || 'scheduled';
  }

  formatTime(time: string): string {
    if (!time) return '—';
    const parts = time.split(':');
    const h = parseInt(parts[0], 10);
    const m = parts[1] ?? '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${ampm}`;
  }

  formatDate(value: Date | string | null | undefined): string {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' });
  }

  formatFee(fee: any): string {
    if (fee === null || fee === undefined || fee === '') return '—';
    const n = Number(fee);
    return isNaN(n) ? String(fee) : n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  print(): void {
    window.print();
  }
}