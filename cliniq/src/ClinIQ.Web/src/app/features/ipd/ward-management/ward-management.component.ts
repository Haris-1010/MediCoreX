import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-ward-management',
  template: `
    <app-main-layout>
      <app-page-header title="Ward Management" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Wards' }]">
        <button mat-raised-button color="primary" (click)="openWardDialog()"><mat-icon>add</mat-icon> Add Ward</button>
      </app-page-header>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="wards.length === 0 && !loading">
        <mat-icon>hotel</mat-icon>
        <h3>No Wards Found</h3>
        <p>Create your first ward to get started, or load sample data.</p>
        <div class="empty-actions">
          <button mat-raised-button color="primary" (click)="openWardDialog()"><mat-icon>add</mat-icon> Create First Ward</button>
          <button mat-stroked-button (click)="seedDefaults()"><mat-icon>auto_fix_high</mat-icon> Load Sample Data</button>
        </div>
      </div>

      <!-- Ward cards -->
      <div class="ward-grid" *ngIf="wards.length > 0">
        <div class="ward-card" *ngFor="let w of wards" [class.selected]="selectedWard?.id === w.id" (click)="selectWard(w)">
          <div class="ward-header">
            <div class="ward-icon"><mat-icon>hotel</mat-icon></div>
            <div class="ward-title">
              <h3>{{ w.name }}</h3>
              <p>{{ w.wardType }} <span *ngIf="w.code"> | {{ w.code }}</span></p>
            </div>
            <div class="ward-actions">
              <button mat-icon-button (click)="openWardDialog(w); $event.stopPropagation()"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteWard(w); $event.stopPropagation()"><mat-icon>delete</mat-icon></button>
            </div>
          </div>
          <div class="ward-stats">
            <div class="stat"><span class="num">{{ w.roomCount || 0 }}</span><span class="label">Rooms</span></div>
            <div class="stat"><span class="num">{{ w.bedCount || 0 }}</span><span class="label">Beds</span></div>
            <div class="stat"><span class="num avail">{{ w.availableBeds || 0 }}</span><span class="label">Free</span></div>
            <div class="stat"><span class="num occ">{{ w.occupiedBeds || 0 }}</span><span class="label">Used</span></div>
          </div>
          <div class="ward-bar" *ngIf="w.bedCount">
            <div class="bar-fill" [style.width.%]="((w.occupiedBeds || 0) / w.bedCount) * 100"></div>
          </div>
        </div>
      </div>

      <!-- Selected Ward: Rooms + Beds -->
      <div class="detail-panel" *ngIf="selectedWard">
        <div class="detail-header">
          <h2>{{ selectedWard.name }} — Rooms & Beds</h2>
          <button mat-raised-button color="primary" (click)="openRoomDialog(selectedWard)"><mat-icon>add</mat-icon> Add Room</button>
        </div>

        <div class="room-card" *ngFor="let r of wardRooms">
          <div class="room-header">
            <div class="room-info">
              <h4>{{ r.roomNumber }} <span *ngIf="r.name">— {{ r.name }}</span></h4>
              <p>{{ r.roomType }} | Capacity: {{ r.capacity }} | {{ r.bedCount || 0 }} beds</p>
            </div>
            <div class="room-actions">
              <button mat-stroked-button (click)="openRoomDialog(selectedWard, r)"><mat-icon>edit</mat-icon></button>
              <button mat-stroked-button color="warn" (click)="deleteRoom(r)"><mat-icon>delete</mat-icon></button>
              <button mat-stroked-button color="primary" (click)="openBedDialog(r)"><mat-icon>add</mat-icon> Bed</button>
              <button mat-stroked-button color="accent" (click)="openBedBatchDialog(r)"><mat-icon>playlist_add</mat-icon> Batch</button>
            </div>
          </div>
          <div class="bed-grid" *ngIf="r.beds?.length">
            <div class="bed-tile" *ngFor="let b of r.beds" [ngClass]="'bed-' + b.status.toLowerCase()">
              <span class="bed-num">{{ b.bedNumber }}</span>
              <span class="bed-type">{{ b.bedType }}</span>
              <span class="bed-patient" *ngIf="b.patientName"><mat-icon>person</mat-icon> {{ b.patientName }}</span>
            </div>
          </div>
          <p class="no-beds" *ngIf="!r.beds?.length">No beds yet. Click "Bed" or "Batch" to add.</p>
        </div>
        <p class="no-data" *ngIf="wardRooms.length === 0">No rooms yet. Click "Add Room" to start.</p>
      </div>
    </app-main-layout>

    <!-- Ward Dialog -->
    <ng-template #wardDialogRef>
      <h2 mat-dialog-title>{{ editingWard ? 'Edit Ward' : 'Add New Ward' }}</h2>
      <mat-dialog-content>
        <form [formGroup]="wardForm">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Ward Name *</mat-label>
              <input matInput formControlName="name" placeholder="e.g., ICU Ward A">
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex1">
              <mat-label>Code *</mat-label>
              <input matInput formControlName="code" placeholder="e.g., ICU-A">
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Ward Type</mat-label>
            <mat-select formControlName="wardType">
              <mat-option value="General">General</mat-option>
              <mat-option value="ICU">ICU</mat-option>
              <mat-option value="CCU">CCU</mat-option>
              <mat-option value="Pediatric">Pediatric</mat-option>
              <mat-option value="Maternity">Maternity</mat-option>
              <mat-option value="Surgical">Surgical</mat-option>
              <mat-option value="Emergency">Emergency</mat-option>
              <mat-option value="Isolation">Isolation</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveWard()" [disabled]="wardForm.invalid || saving">
          {{ saving ? 'Saving...' : (editingWard ? 'Update' : 'Create Ward') }}
        </button>
      </mat-dialog-actions>
    </ng-template>

    <!-- Room Dialog -->
    <ng-template #roomDialogRef>
      <h2 mat-dialog-title>{{ editingRoom ? 'Edit Room' : 'Add Room' }}</h2>
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
          </div>
          <div class="check-row">
            <mat-checkbox formControlName="hasBathroom">Bathroom</mat-checkbox>
            <mat-checkbox formControlName="hasTV">TV</mat-checkbox>
            <mat-checkbox formControlName="hasAC">AC</mat-checkbox>
            <mat-checkbox formControlName="isIsolation">Isolation</mat-checkbox>
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

    <!-- Bed Dialog (single) -->
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
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveBed()" [disabled]="saving">
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
        <button mat-raised-button color="primary" (click)="saveBedBatch()" [disabled]="saving">
          {{ saving ? 'Saving...' : ('Create ' + bedBatchForm.value.count + ' Beds') }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 10px; }
    .empty-state mat-icon { font-size: 72px; width: 72px; height: 72px; color: #ccc; }
    .empty-state h3 { margin: 1rem 0 0.5rem; color: #333; }
    .empty-state p { color: #888; margin-bottom: 1.5rem; }
    .empty-actions { display: flex; gap: 1rem; justify-content: center; }

    .ward-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .ward-card { background: white; border-radius: 10px; padding: 1.25rem; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
    .ward-card:hover { border-color: #3f51b5; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .ward-card.selected { border-color: #3f51b5; background: #e8eaf6; }

    .ward-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .ward-icon { width: 48px; height: 48px; border-radius: 12px; background: #e8eaf6; display: flex; align-items: center; justify-content: center; }
    .ward-icon mat-icon { color: #3f51b5; }
    .ward-title { flex: 1; }
    .ward-title h3 { margin: 0; font-size: 1.1rem; }
    .ward-title p { margin: 2px 0 0; font-size: 0.8rem; color: #888; }
    .ward-actions button { transform: scale(0.85); }

    .ward-stats { display: flex; gap: 1rem; margin-bottom: 0.75rem; }
    .stat { text-align: center; flex: 1; }
    .stat .num { display: block; font-size: 1.25rem; font-weight: 700; }
    .stat .num.avail { color: #4caf50; }
    .stat .num.occ { color: #f44336; }
    .stat .label { font-size: 0.7rem; color: #888; text-transform: uppercase; }

    .ward-bar { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #4caf50, #f44336); border-radius: 3px; }

    .detail-panel { background: white; border-radius: 10px; padding: 1.5rem; margin-top: 1rem; }
    .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .detail-header h2 { margin: 0; font-size: 1.2rem; }

    .room-card { background: #f8f9fa; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border: 1px solid #e0e0e0; }
    .room-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
    .room-info h4 { margin: 0; }
    .room-info p { margin: 2px 0 0; font-size: 0.8rem; color: #888; }
    .room-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .room-actions button { font-size: 0.8rem; }

    .bed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem; }
    .bed-tile { padding: 0.75rem; border-radius: 6px; text-align: center; border: 2px solid transparent; }
    .bed-tile.bed-available { border-color: #4caf50; background: #e8f5e9; }
    .bed-tile.bed-occupied { border-color: #f44336; background: #ffebee; }
    .bed-tile.bed-reserved { border-color: #ff9800; background: #fff3e0; }
    .bed-tile.bed-maintenance { border-color: #9e9e9e; background: #f5f5f5; }
    .bed-num { display: block; font-weight: 700; font-size: 1.1rem; }
    .bed-type { display: block; font-size: 0.7rem; color: #666; }
    .bed-patient { display: flex; align-items: center; justify-content: center; gap: 2px; margin-top: 4px; font-size: 0.7rem; color: #c62828; }
    .bed-patient mat-icon { font-size: 12px; width: 12px; height: 12px; }
    .no-beds, .no-data { text-align: center; color: #aaa; padding: 1rem; font-size: 0.85rem; }

    .form-row { display: flex; gap: 1rem; }
    .form-row mat-form-field { flex: 1; }
    .full-w { width: 100%; }
    .flex1 { flex: 1; }
    .check-row { display: flex; gap: 1rem; flex-wrap: wrap; }
  `]
})
export class WardManagementComponent implements OnInit {
  @ViewChild('wardDialogRef') wardDialogRef!: TemplateRef<any>;
  @ViewChild('roomDialogRef') roomDialogRef!: TemplateRef<any>;
  @ViewChild('bedDialogRef') bedDialogRef!: TemplateRef<any>;
  @ViewChild('bedBatchDialogRef') bedBatchDialogRef!: TemplateRef<any>;

  wards: any[] = [];
  selectedWard: any = null;
  wardRooms: any[] = [];
  editingWard: any = null;
  editingRoom: any = null;
  saving = false;
  loading = true;

  wardForm!: FormGroup;
  roomForm!: FormGroup;
  bedForm!: FormGroup;
  bedBatchForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.wardForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      wardType: ['General']
    });
    this.roomForm = this.fb.group({
      wardId: ['', Validators.required],
      roomNumber: ['', Validators.required],
      name: [''],
      roomType: ['General'],
      capacity: [4],
      hasBathroom: [false],
      hasTV: [false],
      hasAC: [false],
      isIsolation: [false]
    });
    this.bedForm = this.fb.group({
      bedNumber: [''],
      bedType: ['General']
    });
    this.bedBatchForm = this.fb.group({
      count: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
      bedType: ['General'],
      dailyRate: ['']
    });
    this.loadWards();
  }

  loadWards() {
    this.loading = true;
    this.api.get<any>('v1/wards').subscribe({
      next: (r) => {
        this.wards = Array.isArray(r) ? r : [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectWard(ward: any) {
    this.selectedWard = ward;
    this.api.get<any>(`v1/wards/${ward.id}`).subscribe({
      next: (r) => { this.wardRooms = r.rooms || []; }
    });
  }

  openWardDialog(ward?: any) {
    this.editingWard = ward || null;
    if (ward) {
      this.wardForm.patchValue({ name: ward.name, code: ward.code, wardType: ward.wardType });
    } else {
      this.wardForm.reset({ name: '', code: '', wardType: 'General' });
    }
    this.dialog.open(this.wardDialogRef, { width: '500px', disableClose: true });
  }

  saveWard() {
    if (this.wardForm.invalid) return;
    this.saving = true;
    const v = this.wardForm.value;
    const payload = { name: v.name, code: v.code, wardType: v.wardType };
    const req = this.editingWard
      ? this.api.put('v1/wards', this.editingWard.id, payload)
      : this.api.post('v1/wards', payload);
    req.subscribe({
      next: () => {
        this.saving = false;
        this.dialog.closeAll();
        this.notification.success(this.editingWard ? 'Ward updated' : 'Ward created');
        this.loadWards();
      },
      error: () => this.saving = false
    });
  }

  deleteWard(ward: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Ward', message: `Are you sure you want to delete ward "${ward.name}"? This will also remove all rooms and beds.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/wards', ward.id).subscribe({
          next: () => {
            this.notification.success('Ward deleted');
            if (this.selectedWard?.id === ward.id) {
              this.selectedWard = null;
              this.wardRooms = [];
            }
            this.loadWards();
          }
        });
      }
    });
  }

  openRoomDialog(ward?: any, room?: any) {
    this.editingRoom = room || null;
    if (room) {
      this.roomForm.patchValue({
        wardId: room.wardId || ward?.id || '',
        roomNumber: room.roomNumber, name: room.name,
        roomType: room.roomType, capacity: room.capacity,
        hasBathroom: room.hasBathroom, hasTV: room.hasTV,
        hasAC: room.hasAC, isIsolation: room.isIsolation
      });
    } else {
      this.roomForm.reset({
        wardId: ward?.id || '', roomNumber: '', name: '',
        roomType: 'General', capacity: 4,
        hasBathroom: false, hasTV: false, hasAC: false, isIsolation: false
      });
    }
    this.dialog.open(this.roomDialogRef, { width: '550px', disableClose: true });
  }

  saveRoom() {
    if (this.roomForm.invalid) return;
    this.saving = true;
    const v = this.roomForm.value;
    const payload = {
      roomNumber: v.roomNumber, name: v.name || null,
      roomType: v.roomType, capacity: v.capacity || 4
    };
    if (this.editingRoom) {
      this.api.put('v1/wards/rooms', this.editingRoom.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.dialog.closeAll();
          this.notification.success('Room updated');
          if (this.selectedWard) this.selectWard(this.selectedWard);
        },
        error: () => this.saving = false
      });
    } else {
      this.api.post(`v1/wards/${v.wardId}/rooms`, payload).subscribe({
        next: () => {
          this.saving = false;
          this.dialog.closeAll();
          this.notification.success('Room created');
          this.loadWards();
          if (this.selectedWard) this.selectWard(this.selectedWard);
        },
        error: () => this.saving = false
      });
    }
  }

  deleteRoom(room: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Room', message: `Are you sure you want to delete room "${room.roomNumber}"? This will also remove all beds in this room.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/wards/rooms', room.id).subscribe({
          next: () => {
            this.notification.success('Room deleted');
            this.loadWards();
            if (this.selectedWard) this.selectWard(this.selectedWard);
          }
        });
      }
    });
  }

  openBedDialog(room: any) {
    this.editingRoom = room;
    this.bedForm.reset({ bedNumber: '', bedType: 'General' });
    this.dialog.open(this.bedDialogRef, { width: '450px', disableClose: true });
  }

  saveBed() {
    if (this.bedForm.invalid || !this.editingRoom) return;
    this.saving = true;
    const v = this.bedForm.value;
    this.api.post(`v1/wards/rooms/${this.editingRoom.id}/beds`, {
      bedNumber: v.bedNumber || null, bedType: v.bedType
    }).subscribe({
      next: () => {
        this.saving = false;
        this.dialog.closeAll();
        this.notification.success('Bed created');
        this.loadWards();
        if (this.selectedWard) this.selectWard(this.selectedWard);
      },
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
      next: () => {
        this.saving = false;
        this.dialog.closeAll();
        this.notification.success(`${v.count} beds created`);
        this.loadWards();
        if (this.selectedWard) this.selectWard(this.selectedWard);
      },
      error: () => this.saving = false
    });
  }

  seedDefaults() {
    this.saving = true;
    this.api.post<any>('v1/wards/seed-defaults', {}).subscribe({
      next: () => {
        this.notification.success('Sample ward, room, and 10 beds loaded');
        this.loadWards();
        this.saving = false;
      },
      error: () => this.saving = false
    });
  }
}
