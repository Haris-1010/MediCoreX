import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-invoice-form',
  template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Invoice' : 'New Invoice'" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Invoices', route: '/billing/invoices' }, { label: isEdit ? 'Edit' : 'New' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-2"><mat-label>Patient</mat-label>
              <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch">
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients" [value]="p">{{ p.fullName }} ({{ p.mrn }})</mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Invoice Date</mat-label><input matInput [matDatepicker]="picker" formControlName="invoiceDate"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Due Date</mat-label><input matInput [matDatepicker]="duePicker" formControlName="dueDate"><mat-datepicker-toggle matIconSuffix [for]="duePicker"></mat-datepicker-toggle><mat-datepicker #duePicker></mat-datepicker></mat-form-field>
          </div>

          <h3>Invoice Items</h3>
          <div formArrayName="items">
            <div *ngFor="let item of itemsArray.controls; let i = index" [formGroupName]="i" class="item-row">
              <mat-form-field appearance="outline" class="flex-2"><mat-label>Description</mat-label><input matInput formControlName="description"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Qty</mat-label><input matInput type="number" formControlName="quantity" (input)="calculateTotals()"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Rate</mat-label><input matInput type="number" formControlName="unitPrice" (input)="calculateTotals()"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput [value]="getItemTotal(i) | currency" readonly></mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
            </div>
          </div>
          <button mat-stroked-button type="button" (click)="addItem()"><mat-icon>add</mat-icon> Add Item</button>

          <div class="totals">
            <div class="total-row"><span>Subtotal:</span><span>{{ subtotal | currency }}</span></div>
            <div class="total-row"><mat-form-field appearance="outline"><mat-label>Discount</mat-label><input matInput type="number" formControlName="discountAmount" (input)="calculateTotals()"></mat-form-field></div>
            <div class="total-row"><mat-form-field appearance="outline"><mat-label>Tax %</mat-label><input matInput type="number" formControlName="taxPercentage" (input)="calculateTotals()"></mat-form-field><span>{{ taxAmount | currency }}</span></div>
            <div class="total-row grand"><span>Total:</span><span>{{ grandTotal | currency }}</span></div>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput formControlName="notes" rows="2"></textarea></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/billing/invoices">Cancel</button>
            <button mat-stroked-button type="button" (click)="saveAsDraft()">Save as Draft</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Create Invoice' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } h3 { margin: 1.5rem 0 1rem; }
    .form-row, .item-row { display: flex; gap: 1rem; align-items: center; } .form-row mat-form-field, .item-row mat-form-field { flex: 1; } .flex-2 { flex: 2 !important; }
    .full-width { width: 100%; }
    .totals { max-width: 400px; margin-left: auto; margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
    .total-row.grand { border-top: 2px solid #333; font-size: 1.25rem; font-weight: 700; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }`]
})
export class InvoiceFormComponent implements OnInit {
  form!: FormGroup; isEdit = false; saving = false;
  filteredPatients: any[] = [];
  subtotal = 0; taxAmount = 0; grandTotal = 0;

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required], patientSearch: [''], invoiceDate: [new Date(), Validators.required], dueDate: [''],
      items: this.fb.array([]), discountAmount: [0], taxPercentage: [0], notes: ['']
    });
    this.addItem();
    this.form.get('patientSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) this.api.get<any[]>('v1/patients/search', { term: val }).subscribe(r => this.filteredPatients = r);
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') { this.isEdit = true; this.loadInvoice(id); }
  }

  get itemsArray(): FormArray { return this.form.get('items') as FormArray; }

  loadInvoice(id: string) { this.api.getById<any>('v1/invoices', id).subscribe(inv => { this.form.patchValue(inv); this.calculateTotals(); }); }
  displayPatient(p: any): string { return p ? `${p.fullName} (${p.mrn})` : ''; }
  onPatientSelected(e: any) { this.form.patchValue({ patientId: e.option.value.id }); }
  addItem() { this.itemsArray.push(this.fb.group({ description: ['', Validators.required], quantity: [1], unitPrice: [0] })); }
  removeItem(i: number) { this.itemsArray.removeAt(i); this.calculateTotals(); }
  getItemTotal(i: number): number { const item = this.itemsArray.at(i).value; return (item.quantity || 0) * (item.unitPrice || 0); }

  calculateTotals() {
    this.subtotal = this.itemsArray.controls.reduce((sum, c) => sum + this.getItemTotal(this.itemsArray.controls.indexOf(c)), 0);
    const discount = this.form.value.discountAmount || 0;
    const taxRate = this.form.value.taxPercentage || 0;
    this.taxAmount = (this.subtotal - discount) * (taxRate / 100);
    this.grandTotal = this.subtotal - discount + this.taxAmount;
  }

  saveAsDraft() { this.form.patchValue({ status: 'Draft' }); this.submit(); }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const data = { ...this.form.value, subtotal: this.subtotal, taxAmount: this.taxAmount, totalAmount: this.grandTotal };
    const req = this.isEdit ? this.api.put('v1/invoices', this.route.snapshot.paramMap.get('id')!, data) : this.api.post('v1/invoices', data);
    req.subscribe({ next: () => { this.notification.success('Invoice saved'); this.router.navigate(['/billing/invoices']); }, error: () => this.saving = false });
  }
}
