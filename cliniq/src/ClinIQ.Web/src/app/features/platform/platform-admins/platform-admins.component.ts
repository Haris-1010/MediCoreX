import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/notification.service';

interface PlatformAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

@Component({
  standalone: false,
  selector: 'app-platform-admins',
  templateUrl: './platform-admins.component.html',
  styles: [`
    .admins-shell { display: grid; grid-template-columns: minmax(320px, 460px) 1fr; gap: 28px; align-items: start; }
    .panel { background: white; border: 1px solid #dce5e5; border-radius: 12px; padding: 24px; }
    h3 { margin: 0 0 4px; color: #172033; }
    .subtitle { color: #64748b; font-size: 13px; margin: 0 0 16px; }
    form { display: grid; gap: 2px 16px; grid-template-columns: 1fr 1fr; }
    .full { grid-column: 1 / -1; }
    button[type=submit] { margin-top: 8px; justify-self: end; }
    .list-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #edf1f1; }
    .list-row:last-child { border-bottom: none; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #102b35; color: #f0b35b; display: grid; place-items: center; font-weight: 700; flex-shrink: 0; }
    .row-info { flex: 1; min-width: 0; }
    .row-info strong { display: block; font-size: 14px; }
    .row-info small { color: #64748b; }
    .status-chip { padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .status-chip.active { background: #e5f6ec; color: #18794e; }
    .status-chip.inactive { background: #fdecea; color: #b42318; }
    .loading { display: grid; place-items: center; padding: 40px; }
    .empty { text-align: center; color: #64748b; padding: 24px; }
    @media (max-width: 800px) { .admins-shell { grid-template-columns: 1fr; } }
  `]
})
export class PlatformAdminsComponent implements OnInit {
  admins: PlatformAdmin[] = [];
  form!: FormGroup;
  saving = false;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['']
    });
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loading = true;
    this.http.get<PlatformAdmin[]>(`${environment.apiUrl}/v1/platform/admins`).subscribe({
      next: admins => { this.admins = admins || []; this.loading = false; },
      error: () => { this.loading = false; this.notification.error('Unable to load platform admins.'); }
    });
  }

  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.http.post<any>(`${environment.apiUrl}/v1/platform/admins`, this.form.value).subscribe({
      next: response => {
        this.saving = false;
        this.notification.info(`Admin created. Share this password now: ${response.temporaryPassword}`);
        this.form.reset();
        this.loadAdmins();
      },
      error: error => {
        this.saving = false;
        this.notification.error(error.error?.message || 'Platform admin could not be created.');
      }
    });
  }

  toggle(admin: PlatformAdmin): void {
    const action = admin.isActive ? 'suspend' : 'activate';
    this.http.post(`${environment.apiUrl}/v1/platform/admins/${admin.id}/${action}`, {}).subscribe({
      next: () => {
        this.notification.success(`${admin.firstName} ${admin.lastName} ${admin.isActive ? 'suspended' : 'activated'}.`);
        this.loadAdmins();
      },
      error: error => this.notification.error(error.error?.message || 'Status could not be changed.')
    });
  }
}