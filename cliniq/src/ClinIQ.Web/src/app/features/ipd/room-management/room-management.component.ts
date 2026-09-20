import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-room-management',
  template: `
    <app-main-layout>
      <app-page-header title="Room Management" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Rooms' }]">
        <button mat-raised-button color="primary" (click)="openRoomDialog()"><mat-icon>add</mat-icon> Add Room</button>
      </app-page-header>

      <!-- Ward Filter -->
      <div class="filter-bar">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Filter by Ward</mat-label>
          <mat-select [(value)]="selectedWardFilter" (selectionChange)="loadRooms()">
            <mat-option value="">All Wards</mat-option>
            <mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }} ({{ w.wardType }})</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Rooms Grid -->
      <div class="rooms-grid" *ngIf="rooms.length > 0">
        <div class="room-card" *ngFor="let r of rooms" [ngClass]="'room-' + (r.roomType || 'general').toLowerCase()">
          <!-- Room Header -->
          <div class="room-header">
            <div class="room-icon-wrapper" [ngClass]="'room-' + (r.roomType || 'general').toLowerCase()">
              <mat-icon>{{ getRoomIcon(r.roomType) }}</mat-icon>
            </div>
            <div class="room-info">
              <h3>{{ r.roomNumber }}</h3>
              <p>{{ r.name || 'Unnamed Room' }}</p>
            </div>
            <div class="room-type-badge">{{ r.roomType }}</div>
          </div>

          <!-- Room Details -->
          <div class="room-details">
            <div class="detail-row">
              <mat-icon>local_hospital</mat-icon>
              <span>{{ r.wardName }}</span>
            </div>
            <div class="detail-row">
              <mat-icon>people</mat-icon>
              <span>Capacity: {{ r.capacity }}</span>
            </div>
            <div class="detail-row">
              <mat-icon>bed</mat-icon>
              <span>{{ r.bedCount || 0 }} Beds <span *ngIf="r.availableBeds > 0" class="free-badge">({{ r.availableBeds }} free)</span></span>
            </div>
            <div class="detail-row" *ngIf="r.dailyRate">
              <mat-icon>attach_money</mat-icon>
              <span>{{ r.dailyRate | currencyFormat }}/day</span>
            </div>
          </div>

          <!-- Features -->
          <div class="room-features" *ngIf="hasFeatures(r)">
            <span class="feature-chip" *ngIf="r.hasBathroom"><mat-icon>bathtub</mat-icon> Bathroom</span>
            <span class="feature-chip" *ngIf="r.hasTV"><mat-icon>tv</mat-icon> TV</span>
            <span class="feature-chip" *ngIf="r.hasAC"><mat-icon>ac_unit</mat-icon> AC</span>
            <span class="feature-chip" *ngIf="r.isIsolation"><mat-icon>security</mat-icon> Isolation</span>
          </div>

          <!-- Actions -->
          <div class="room-actions">
            <button mat-icon-button (click)="openBedDialog(r)" matTooltip="Add Bed" class="action-btn bed-btn">
              <mat-icon>bed</mat-icon>
            </button>
            <button mat-icon-button (click)="openBedBatchDialog(r)" matTooltip="Add Batch" class="action-btn batch-btn">
              <mat-icon>playlist_add</mat-icon>
            </button>
            <button mat-icon-button (click)="openRoomDialog(r)" matTooltip="Edit Room" class="action-btn edit-btn">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteRoom(r)" matTooltip="Delete Room" class="action-btn delete-btn">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="rooms.length === 0">
        <div class="empty-icon"><mat-icon>meeting_room</mat-icon></div>
        <h3>No Rooms Found</h3>
        <p>{{ selectedWardFilter ? 'No rooms in this ward.' : 'Create your first room to get started.' }}</p>
        <button mat-raised-button color="primary" (click)="openRoomDialog()"><mat-icon>add</mat-icon> Add Room</button>
      </div>
    </app-main-layout>

    <!-- Room Dialog -->
    <ng-template #roomDialogRef>
      <h2 mat-dialog-title>{{ editingRoom ? 'Edit Room' : 'Add New Room' }}</h2>
      <mat-dialog-content>
        <form [formGroup]="roomForm">
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Ward *</mat-label>
            <mat-select formControlName="wardId">
              <mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }} ({{ w.wardType }})</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Room Number *</mat-label>
              <input matInput formControlName="roomNumber" placeholder="e.g., R101">
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Room Name</mat-label>
              <input matInput formControlName="name" placeholder="e.g., Room 1">
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Room Type</mat-label>
              <mat-select formControlName="roomType">
                <mat-option value="General">General</mat-option>
                <mat-option value="Private">Private</mat-option>
                <mat-option value="SemiPrivate">Semi-Private</mat-option>
                <mat-option value="ICU">ICU</mat-option>
                <mat-option value="Isolation">Isolation</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Capacity</mat-label>
              <input matInput type="number" formControlName="capacity" min="1">
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Daily Rate</mat-label>
              <input matInput type="number" formControlName="dailyRate" min="0">
            </mat-form-field>
          </div>
          <div class="check-row">
            <mat-checkbox formControlName="hasBathroom"><mat-icon>bathtub</mat-icon> Bathroom</mat-checkbox>
            <mat-checkbox formControlName="hasTV"><mat-icon>tv</mat-icon> TV</mat-checkbox>
            <mat-checkbox formControlName="hasAC"><mat-icon>ac_unit</mat-icon> AC</mat-checkbox>
            <mat-checkbox formControlName="isIsolation"><mat-icon>security</mat-icon> Isolation</mat-checkbox>
          </div>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveRoom()" [disabled]="roomForm.invalid || saving">
          {{ saving ? 'Saving...' : (editingRoom ? 'Update Room' : 'Create Room') }}
        </button>
      </mat-dialog-actions>
    </ng-template>

    <!-- Bed Dialog -->
    <ng-template #bedDialogRef>
      <h2 mat-dialog-title>Add Bed to {{ editingRoom?.roomNumber }}</h2>
      <mat-dialog-content>
        <form [formGroup]="bedForm">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Bed Number</mat-label>
              <input matInput formControlName="bedNumber" placeholder="Auto if empty">
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Bed Type</mat-label>
              <mat-select formControlName="bedType">
                <mat-option value="General">General</mat-option>
                <mat-option value="ICU">ICU</mat-option>
                <mat-option value="Pediatric">Pediatric</mat-option>
                <mat-option value="Maternity">Maternity</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Daily Rate (PKR)</mat-label>
            <input matInput type="number" formControlName="dailyRate" min="0">
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveBed()" [disabled]="bedForm.invalid || saving">
          {{ saving ? 'Saving...' : 'Create Bed' }}
        </button>
      </mat-dialog-actions>
    </ng-template>

    <!-- Bed Batch Dialog -->
    <ng-template #bedBatchDialogRef>
      <h2 mat-dialog-title>Add Multiple Beds to {{ editingRoom?.roomNumber }}</h2>
      <mat-dialog-content>
        <form [formGroup]="bedBatchForm">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Number of Beds *</mat-label>
              <input matInput type="number" formControlName="count" min="1" max="50">
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Bed Type</mat-label>
              <mat-select formControlName="bedType">
                <mat-option value="General">General</mat-option>
                <mat-option value="ICU">ICU</mat-option>
                <mat-option value="Pediatric">Pediatric</mat-option>
                <mat-option value="Maternity">Maternity</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Daily Rate (PKR)</mat-label>
            <input matInput type="number" formControlName="dailyRate" min="0">
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveBedBatch()" [disabled]="bedBatchForm.invalid || saving">
          {{ saving ? 'Saving...' : ('Create ' + bedBatchForm.value.count + ' Beds') }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .filter-bar { margin-bottom: 1.5rem; }
    .filter-field { width: 320px; }

    /* Rooms Grid */
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .room-card {
      background: var(--bg-card, #fff);
      border-radius: 16px;
      border: 1px solid var(--border-color, #e8eaf6);
      overflow: hidden;
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
    }
    .room-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg, 0 12px 32px rgba(63, 81, 181, 0.15));
      border-color: #3f51b5;
    }

    /* Room Type Variants */
    .room-general { border-left: 4px solid #4caf50; }
    .room-private { border-left: 4px solid #3f51b5; }
    .room-semiprivate { border-left: 4px solid #ff9800; }
    .room-icu { border-left: 4px solid #f44336; }
    .room-isolation { border-left: 4px solid #9c27b0; }

    .room-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);
      border-bottom: 1px solid #f0f0f0;
    }
    .room-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1));
    }
    .room-icon-wrapper mat-icon { font-size: 28px; width: 28px; height: 28px; color: white; }
    .room-general .room-icon-wrapper { background: linear-gradient(135deg, #4caf50, #66bb6a); }
    .room-private .room-icon-wrapper { background: linear-gradient(135deg, #3f51b5, #5c6bc0); }
    .room-semiprivate .room-icon-wrapper { background: linear-gradient(135deg, #ff9800, #ffb74d); }
    .room-icu .room-icon-wrapper { background: linear-gradient(135deg, #f44336, #ef5350); }
    .room-isolation .room-icon-wrapper { background: linear-gradient(135deg, #9c27b0, #ba68c8); }

    .room-info { flex: 1; min-width: 0; }
    .room-info h3 { margin: 0 0 0.25rem; font-size: 1.125rem; font-weight: 700; color: #1a237e; }
    .room-info p { margin: 0; font-size: 0.8rem; color: var(--text-muted, #666); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .room-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .room-general .room-type-badge { background: #e8f5e9; color: #2e7d32; }
    .room-private .room-type-badge { background: #e8eaf6; color: #1a237e; }
    .room-semiprivate .room-type-badge { background: #fff3e0; color: #ef6c00; }
    .room-icu .room-type-badge { background: #ffebee; color: #c62828; }
    .room-isolation .room-type-badge { background: #f3e5f5; color: #7b1fa2; }

    .room-details { padding: 1rem 1.25rem; flex: 1; }
    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.5rem 0;
      font-size: 0.85rem;
      color: var(--text-primary, #444);
    }
    .detail-row mat-icon { font-size: 18px; width: 18px; height: 18px; color: #7986cb; flex-shrink: 0; }
    .free-badge { color: #4caf50; font-weight: 600; font-size: 0.75rem; margin-left: 0.375rem; }

    .room-features {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      padding: 0.75rem 1.25rem;
      background: #fafbff;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }
    .feature-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      background: #e8eaf6;
      color: #3f51b5;
      border-radius: 16px;
      font-size: 0.7rem;
      font-weight: 500;
    }
    .feature-chip mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .room-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.375rem;
      padding: 0.75rem 1.25rem;
      background: var(--bg-hover, #fafafa);
      border-top: 1px solid var(--border-color, #f0f0f0);
    }
    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      transition: all 0.2s ease;
    }
    .action-btn:hover { transform: scale(1.1); }
    .action-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .bed-btn { background: #e8f5e9; color: #2e7d32; }
    .bed-btn:hover { background: #4caf50; color: white; }
    .batch-btn { background: #e3f2fd; color: #1565c0; }
    .batch-btn:hover { background: #3f51b5; color: white; }
    .edit-btn { background: #fff3e0; color: #ef6c00; }
    .edit-btn:hover { background: #ff9800; color: white; }
    .delete-btn { background: #ffebee; color: #c62828; }
    .delete-btn:hover { background: #f44336; color: white; }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-card, #fff);
      border-radius: 16px;
      border: 2px dashed var(--border-color, #e0e0e0);
    }
    .empty-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8eaf6, #f5f5ff);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    .empty-icon mat-icon { font-size: 48px; width: 48px; height: 48px; color: #3f51b5; }
    .empty-state h3 { margin: 0 0 0.5rem; color: var(--text-primary, #333); font-size: 1.25rem; }
    .empty-state p { color: var(--text-muted, #888); margin-bottom: 1.5rem; }

    /* Dialog Styles */
    .form-row { display: flex; gap: 1rem; }
    .form-row mat-form-field { flex: 1; }
    .full-w { width: 100%; }
    .flex1 { flex: 1; }
    .check-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .check-row mat-checkbox { display: flex; align-items: center; gap: 0.375rem; min-height: 36px; }
    .check-row mat-checkbox mat-icon { font-size: 18px; width: 18px; height: 18px; color: #3f51b5; }
    
    ::ng-deep .mat-mdc-dialog-content { padding: 20px 24px !important; min-width: 450px; }
    ::ng-deep .mat-mdc-dialog-actions { padding: 8px 24px 20px !important; }
    ::ng-deep .mat-mdc-form-field { margin-bottom: 12px; }
    ::ng-deep .mat-mdc-checkbox { margin-bottom: 4px; }
  `]
})
export class RoomManagementComponent implements OnInit {
  @ViewChild('roomDialogRef') roomDialogRef!: TemplateRef<any>;
  @ViewChild('bedDialogRef') bedDialogRef!: TemplateRef<any>;
  @ViewChild('bedBatchDialogRef') bedBatchDialogRef!: TemplateRef<any>;

  wards: any[] = [];
  rooms: any[] = [];
  selectedWardFilter = '';
  editingRoom: any = null;
  saving = false;

  roomForm!: FormGroup;
  bedForm!: FormGroup;
  bedBatchForm!: FormGroup;

  columns = ['roomNumber', 'name', 'wardName', 'roomType', 'capacity', 'beds', 'features', 'dailyRate', 'actions'];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.roomForm = this.fb.group({
      wardId: ['', Validators.required],
      roomNumber: ['', Validators.required],
      name: [''],
      roomType: ['General'],
      capacity: [4],
      dailyRate: [''],
      hasBathroom: [false],
      hasTV: [false],
      hasAC: [false],
      isIsolation: [false]
    });
    this.bedForm = this.fb.group({
      bedNumber: [''],
      bedType: ['General'],
      dailyRate: ['']
    });
    this.bedBatchForm = this.fb.group({
      count: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
      bedType: ['General'],
      dailyRate: ['']
    });
    this.loadWards();
    this.loadRooms();
  }

  loadWards() {
    this.api.get<any>('v1/wards').subscribe({
      next: (r) => { this.wards = Array.isArray(r) ? r : []; }
    });
  }

  loadRooms() {
    const url = this.selectedWardFilter
      ? `v1/wards/rooms?wardId=${this.selectedWardFilter}`
      : 'v1/wards/rooms';
    this.api.get<any>(url).subscribe({
      next: (r) => { this.rooms = Array.isArray(r) ? r : []; }
    });
  }

  getRoomIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'icu': return 'medical_services';
      case 'isolation': return 'security';
      case 'private': return 'king_bed';
      case 'semiprivate': return 'double_bed';
      default: return 'meeting_room';
    }
  }

  hasFeatures(r: any): boolean {
    return r.hasBathroom || r.hasTV || r.hasAC || r.isIsolation;
  }

  openRoomDialog(room?: any) {
    this.editingRoom = room || null;
    if (room) {
      this.roomForm.patchValue({
        wardId: room.wardId, roomNumber: room.roomNumber, name: room.name,
        roomType: room.roomType, capacity: room.capacity, dailyRate: room.dailyRate,
        hasBathroom: room.hasBathroom, hasTV: room.hasTV, hasAC: room.hasAC, isIsolation: room.isIsolation
      });
    } else {
      this.roomForm.reset({ wardId: '', roomNumber: '', name: '', roomType: 'General', capacity: 4, dailyRate: '', hasBathroom: false, hasTV: false, hasAC: false, isIsolation: false });
    }
    this.dialog.open(this.roomDialogRef, { width: '600px', disableClose: true });
  }

  saveRoom() {
    if (this.roomForm.invalid) return;
    this.saving = true;
    const v = this.roomForm.value;
    const payload = {
      roomNumber: v.roomNumber, name: v.name || null,
      roomType: v.roomType, capacity: v.capacity || 4,
      dailyRate: v.dailyRate || null,
      hasBathroom: v.hasBathroom || false,
      hasTV: v.hasTV || false,
      hasAC: v.hasAC || false,
      isIsolation: v.isIsolation || false
    };
    if (this.editingRoom) {
      this.api.put('v1/wards/rooms', this.editingRoom.id, payload).subscribe({
        next: () => { this.saving = false; this.dialog.closeAll(); this.notification.success('Room updated'); this.loadRooms(); },
        error: () => this.saving = false
      });
    } else {
      this.api.post(`v1/wards/${v.wardId}/rooms`, payload).subscribe({
        next: () => { this.saving = false; this.dialog.closeAll(); this.notification.success('Room created'); this.loadRooms(); },
        error: () => this.saving = false
      });
    }
  }

  deleteRoom(room: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Room', message: `Are you sure you want to delete room "${room.roomNumber}"? This action cannot be undone.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/wards/rooms', room.id).subscribe({
          next: () => { this.notification.success('Room deleted'); this.loadRooms(); }
        });
      }
    });
  }

  openBedDialog(room: any) {
    this.editingRoom = room;
    this.bedForm.reset({ bedNumber: '', bedType: 'General', dailyRate: '' });
    this.dialog.open(this.bedDialogRef, { width: '450px', disableClose: true });
  }

  saveBed() {
    if (this.bedForm.invalid || !this.editingRoom) return;
    this.saving = true;
    const v = this.bedForm.value;
    this.api.post(`v1/wards/rooms/${this.editingRoom.id}/beds`, {
      bedNumber: v.bedNumber || null, bedType: v.bedType, dailyRate: v.dailyRate || null
    }).subscribe({
      next: () => { this.saving = false; this.dialog.closeAll(); this.notification.success('Bed created'); this.loadRooms(); },
      error: () => this.saving = false
    });
  }

  openBedBatchDialog(room: any) {
    this.editingRoom = room;
    this.bedBatchForm.reset({ count: 5, bedType: 'General', dailyRate: '' });
    this.dialog.open(this.bedBatchDialogRef, { width: '450px', disableClose: true });
  }

  saveBedBatch() {
    if (this.bedBatchForm.invalid || !this.editingRoom) return;
    this.saving = true;
    const v = this.bedBatchForm.value;
    this.api.post(`v1/wards/rooms/${this.editingRoom.id}/beds/batch`, {
      count: v.count, bedType: v.bedType, dailyRate: v.dailyRate || null
    }).subscribe({
      next: () => { this.saving = false; this.dialog.closeAll(); this.notification.success(`${v.count} beds created`); this.loadRooms(); },
      error: () => this.saving = false
    });
  }
}