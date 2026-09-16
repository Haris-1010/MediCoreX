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

      <!-- Filters -->
      <div class="filter-bar">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Filter by Ward</mat-label>
          <mat-select [(value)]="selectedWardFilter" (selectionChange)="loadRooms()">
            <mat-option value="">All Wards</mat-option>
            <mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Rooms Table -->
      <div class="table-container" *ngIf="rooms.length > 0">
        <table mat-table [dataSource]="rooms" class="full-width-table">
          <ng-container matColumnDef="roomNumber">
            <th mat-header-cell *matHeaderCellDef>Room #</th>
            <td mat-cell *matCellDef="let r">{{ r.roomNumber }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let r">{{ r.name || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="wardName">
            <th mat-header-cell *matHeaderCellDef>Ward</th>
            <td mat-cell *matCellDef="let r">{{ r.wardName }}</td>
          </ng-container>
          <ng-container matColumnDef="roomType">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let r">{{ r.roomType }}</td>
          </ng-container>
          <ng-container matColumnDef="capacity">
            <th mat-header-cell *matHeaderCellDef>Capacity</th>
            <td mat-cell *matCellDef="let r">{{ r.capacity }}</td>
          </ng-container>
          <ng-container matColumnDef="beds">
            <th mat-header-cell *matHeaderCellDef>Beds</th>
            <td mat-cell *matCellDef="let r">
              <span class="bed-count">{{ r.bedCount || 0 }}</span>
              <span class="bed-avail" *ngIf="r.availableBeds"> ({{ r.availableBeds }} free)</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="features">
            <th mat-header-cell *matHeaderCellDef>Features</th>
            <td mat-cell *matCellDef="let r">
              <span class="feature-tag" *ngIf="r.hasBathroom">Bath</span>
              <span class="feature-tag" *ngIf="r.hasTV">TV</span>
              <span class="feature-tag" *ngIf="r.hasAC">AC</span>
              <span class="feature-tag" *ngIf="r.isIsolation">Iso</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="dailyRate">
            <th mat-header-cell *matHeaderCellDef>Rate</th>
            <td mat-cell *matCellDef="let r">{{ r.dailyRate ? (r.dailyRate | currency:'PKR':'symbol':'1.0-0') : '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button (click)="openRoomDialog(r)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteRoom(r)"><mat-icon>delete</mat-icon></button>
              <button mat-icon-button (click)="openBedDialog(r)" matTooltip="Add Bed"><mat-icon>bed</mat-icon></button>
              <button mat-icon-button (click)="openBedBatchDialog(r)" matTooltip="Add Batch"><mat-icon>playlist_add</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>

      <div class="empty-state" *ngIf="rooms.length === 0">
        <mat-icon>meeting_room</mat-icon>
        <p>No rooms found.</p>
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
    .filter-bar { margin-bottom: 1rem; }
    .filter-field { width: 300px; }

    .table-container { background: white; border-radius: 10px; overflow: hidden; }
    .full-width-table { width: 100%; }
    .bed-count { font-weight: 600; }
    .bed-avail { color: #4caf50; font-size: 0.8rem; }
    .feature-tag { display: inline-block; padding: 1px 6px; border-radius: 4px; background: #e8eaf6; color: #3f51b5; font-size: 0.7rem; margin-right: 4px; font-weight: 500; }

    .empty-state { text-align: center; padding: 3rem; background: white; border-radius: 10px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ddd; }
    .empty-state p { color: #888; margin: 1rem 0; }

    .form-row { display: flex; gap: 1rem; }
    .form-row mat-form-field { flex: 1; }
    .full-w { width: 100%; }
    .flex1 { flex: 1; }
    .check-row { display: flex; gap: 1rem; flex-wrap: wrap; }
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
      dailyRate: v.dailyRate || null
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
