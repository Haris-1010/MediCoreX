import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';
import { MatDialog } from '@angular/material/dialog';
import { ClinicalService } from '../../services/models/service.model';

@Component({
  standalone: false,
  selector: 'app-invoice-form',
  template: `
    <app-main-layout>
      <app-page-header
        [title]="isEdit ? 'Edit Invoice' : 'New Invoice'"
        [breadcrumbs]="[
          { label: 'Billing', route: '/billing' },
          { label: 'Invoices', route: '/billing/invoices' },
          { label: isEdit ? 'Edit' : 'New' }
        ]">
      </app-page-header>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="invoice-form-container">

          <!-- Patient + Dates -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon"><mat-icon>person</mat-icon></div>
              <div>
                <h3 class="section-title">Patient & Dates</h3>
              </div>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="flex-2">
                <mat-label>Patient</mat-label>
                <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch"
                       placeholder="Search by name or phone..."
                       (focus)="onPatientFocus()"
                       (input)="onPatientSearchInput($event)">
                <mat-icon matPrefix>search</mat-icon>
                <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient"
                                 (optionSelected)="onPatientSelected($event)">
                  <mat-option *ngFor="let p of filteredPatients" [value]="p">
                    <div class="patient-option-item">
                      <span class="name">{{ p.fullName }} ({{ p.phone || 'No phone' }})</span>
                    </div>
                  </mat-option>
                  <mat-option *ngIf="showQuickAdd" (click)="openQuickAddDialog()" class="quick-add-option">
                    <mat-icon>person_add</mat-icon>
                    <span>Quick Add New Patient: "{{ searchTerm }}"</span>
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>
              <button mat-stroked-button type="button" class="quick-add-btn" (click)="openQuickAddDialog()">
                <mat-icon>person_add</mat-icon> Quick Add
              </button>

              <mat-form-field appearance="outline">
                <mat-label>Invoice Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="invoiceDate">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Due Date</mat-label>
                <input matInput [matDatepicker]="duePicker" formControlName="dueDate">
                <mat-datepicker-toggle matIconSuffix [for]="duePicker"></mat-datepicker-toggle>
                <mat-datepicker #duePicker></mat-datepicker>
              </mat-form-field>
            </div>
          </div>

          <!-- Invoice Items -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon"><mat-icon>receipt_long</mat-icon></div>
              <div>
                <h3 class="section-title">Items</h3>
              </div>
              <span class="item-count" *ngIf="itemsArray.length > 0">
                {{ itemsArray.length }} item{{ itemsArray.length > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Combined Search Bar -->
            <div class="item-search-bar">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Search Service or Inventory Item</mat-label>
                <input matInput formControlName="itemSearch"
                       placeholder="Type to search services and inventory items..."
                       (focus)="onItemFocus()"
                       (input)="onItemSearchInput($event)"
                       (keydown)="onItemKeydown($event)">
                <mat-icon matPrefix>search</mat-icon>
              </mat-form-field>
              <div class="search-results" *ngIf="combinedResults.length > 0">
                <div class="search-result-item" *ngFor="let r of combinedResults"
                     (click)="addSelectedItem(r)">
                  <span class="result-type" [class]="'type-' + r._type">{{ r._type === 'service' ? 'SVC' : 'INV' }}</span>
                  <span class="result-name">{{ r._name }}</span>
                  <span class="result-code" *ngIf="r._code">{{ r._code }}</span>
                  <span class="result-price">{{ r._price | currencyFormat }}</span>
                  <span class="result-stock" *ngIf="r._stock !== null">Stock: {{ r._stock }}</span>
                </div>
              </div>
            </div>

            <div formArrayName="items">
              <div class="item-header" *ngIf="itemsArray.length > 0">
                <span class="hdr-type">Type</span>
                <span class="hdr-desc">Description</span>
                <span class="hdr-qty">Qty</span>
                <span class="hdr-rate">Rate</span>
                <span class="hdr-amount">Amount</span>
                <span class="hdr-action"></span>
              </div>

              <div *ngFor="let item of itemsArray.controls; let i = index"
                   [formGroupName]="i" class="item-row">
                <div class="type-badge" [class]="'type-' + (item.get('itemType')?.value || 'service')">
                  {{ item.get('itemType')?.value === 'service' ? 'SVC' : 'INV' }}
                </div>

                <mat-form-field appearance="outline" class="desc-field">
                  <mat-label>Description</mat-label>
                  <input matInput formControlName="description">
                </mat-form-field>

                <mat-form-field appearance="outline" class="qty-field">
                  <mat-label>Qty</mat-label>
                  <input matInput type="number" formControlName="quantity" min="1">
                </mat-form-field>

                <mat-form-field appearance="outline" class="rate-field">
                  <mat-label>Rate</mat-label>
                  <input matInput type="number" formControlName="unitPrice" min="0">
                </mat-form-field>

                <mat-form-field appearance="outline" class="amount-field">
                  <mat-label>Amount</mat-label>
                  <input matInput [value]="getItemTotal(i) | currencyFormat" readonly>
                </mat-form-field>

                <button mat-icon-button color="warn" type="button"
                        (click)="removeItem(i)" matTooltip="Remove" class="remove-btn">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </div>

            <button mat-stroked-button type="button" (click)="addItem()"
                    color="primary" class="add-item-btn" *ngIf="itemsArray.length === 0">
              <mat-icon>add</mat-icon> Add Empty Item
            </button>
          </div>

          <!-- Discount + Totals -->
          <div class="section-card">
            <div class="compact-grid">

              <!-- Left: Discount -->
              <div class="discount-col">
                <div class="mini-header">
                  <mat-icon>local_offer</mat-icon>
                  <span>Discount</span>
                </div>

                <!-- Primary: Flat / % -->
                <div class="discount-row">
                  <mat-form-field appearance="outline" class="discount-input">
                    <mat-label>Discount</mat-label>
                    <input matInput type="number" formControlName="discountAmount" min="0">
                  </mat-form-field>
                  <mat-button-toggle-group formControlName="discountType" class="discount-toggle">
                    <mat-button-toggle value="flat">Flat</mat-button-toggle>
                    <mat-button-toggle value="percent">%</mat-button-toggle>
                  </mat-button-toggle-group>
                </div>

                <!-- Optional Template -->
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Template (Optional)</mat-label>
                  <mat-select formControlName="selectedDiscountId" (selectionChange)="onDiscountSelected()">
                    <mat-option [value]="null">None</mat-option>
                    <mat-option *ngFor="let d of availableDiscounts" [value]="d.id">
                      {{ d.name }}
                      ({{ d.type === 'Percent' ? (d.value / 100 | percent:'1.0-1') : (d.value | currencyFormat) }})
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="discount-applied" *ngIf="discountValue > 0">
                  <mat-icon>check_circle</mat-icon>
                  <span>Discount applied: <strong>-{{ discountValue | currencyFormat }}</strong></span>
                </div>
              </div>

              <!-- Right: Totals -->
              <div class="totals-col">
                <div class="mini-header">
                  <mat-icon>calculate</mat-icon>
                  <span>Totals</span>
                </div>

                <div class="total-line">
                  <span>Subtotal</span>
                  <span>{{ subtotal | currencyFormat }}</span>
                </div>
                <div class="total-line discount-line" *ngIf="discountValue > 0">
                  <span>Discount</span>
                  <span>-{{ discountValue | currencyFormat }}</span>
                </div>
                <div class="total-line tax-line">
                  <mat-form-field appearance="outline" class="tax-field">
                    <mat-label>Tax %</mat-label>
                    <input matInput type="number" formControlName="taxPercentage" min="0" max="100">
                  </mat-form-field>
                  <span>{{ taxAmount | currencyFormat }}</span>
                </div>
                <div class="total-line grand-total">
                  <span>Grand Total</span>
                  <span>{{ grandTotal | currencyFormat }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment (Always visible) -->
          <div class="section-card payment-card" *ngIf="grandTotal > 0">
            <div class="section-header">
              <div class="section-icon payment-icon"><mat-icon>payment</mat-icon></div>
              <div>
                <h3 class="section-title">Payment</h3>
              </div>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Amount</mat-label>
                <input matInput type="number" formControlName="paymentAmount"
                       [max]="grandTotal" min="0">
                <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Method</mat-label>
                <mat-select formControlName="paymentMethod">
                  <mat-option value="Cash">Cash</mat-option>
                  <mat-option value="Card">Card</mat-option>
                  <mat-option value="BankTransfer">Bank Transfer</mat-option>
                  <mat-option value="Check">Check</mat-option>
                  <mat-option value="Insurance">Insurance</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline"
                              *ngIf="form.get('paymentMethod')?.value !== 'Cash'">
                <mat-label>Reference #</mat-label>
                <input matInput formControlName="paymentReference">
              </mat-form-field>
            </div>

            <div class="payment-summary">
              <div class="summary-row">
                <span>Invoice Total</span>
                <span>{{ grandTotal | currencyFormat }}</span>
              </div>
              <div class="summary-row">
                <span>Paying Now</span>
                <span>{{ form.get('paymentAmount')?.value | currencyFormat }}</span>
              </div>
              <div class="summary-row balance-row">
                <span>Balance</span>
                <span [class.paid]="(grandTotal - (form.get('paymentAmount')?.value || 0)) <= 0">
                  {{ (grandTotal - (form.get('paymentAmount')?.value || 0)) | currencyFormat }}
                </span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="section-card notes-card">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes (Optional)</mat-label>
              <textarea matInput formControlName="notes" rows="2"
                        placeholder="Any additional notes..."></textarea>
            </mat-form-field>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/billing/invoices">
              <mat-icon>close</mat-icon> Cancel
            </button>
            <button mat-stroked-button type="button" (click)="saveAsDraft()" class="draft-btn">
              <mat-icon>save</mat-icon> Draft
            </button>
            <button mat-raised-button color="primary" type="submit"
                    [disabled]="form.invalid || saving" class="submit-btn">
              <mat-icon>{{ isEdit ? 'update' : 'check_circle' }}</mat-icon>
              {{ saving ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Create Invoice') }}
            </button>
          </div>

        </div>
      </form>

      <!-- Quick Add Patient Dialog -->
      <ng-template #quickAddDialog>
        <h2 mat-dialog-title>
          <mat-icon>person_add</mat-icon> Quick Add Patient
        </h2>
        <mat-dialog-content>
          <form [formGroup]="quickPatientForm">
            <div class="dialog-form-row">
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>First Name *</mat-label>
                <input matInput formControlName="firstName" placeholder="First name">
                <mat-error>Required</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Last name">
              </mat-form-field>
            </div>
            <div class="dialog-form-row">
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone" placeholder="Phone number">
              </mat-form-field>
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>Gender</mat-label>
                <mat-select formControlName="gender">
                  <mat-option value="Male">Male</mat-option>
                  <mat-option value="Female">Female</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="dialog-form-row">
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>Age *</mat-label>
                <input matInput type="number" formControlName="age" placeholder="Years" min="0" max="150" (input)="onAgeChange()">
                <span matSuffix>years</span>
                <mat-error>Required</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>Date of Birth (auto)</mat-label>
                <input matInput [matDatepicker]="dobPicker2" formControlName="dateOfBirth" readonly placeholder="Auto-calculated">
                <mat-datepicker-toggle matSuffix [for]="dobPicker2"></mat-datepicker-toggle>
                <mat-datepicker #dobPicker2></mat-datepicker>
              </mat-form-field>
            </div>
          </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>Cancel</button>
          <button mat-raised-button color="primary" (click)="saveQuickPatient()" [disabled]="quickPatientForm.invalid || savingPatient">
            <mat-spinner *ngIf="savingPatient" diameter="20"></mat-spinner>
            Save & Select
          </button>
        </mat-dialog-actions>
      </ng-template>
    </app-main-layout>
  `,
  styles: [`
    .invoice-form-container {
      max-width: 1050px;
      margin: 0 auto;
      padding-bottom: 1rem;
    }

    .section-card {
      background: var(--bg-card, #fff);
      padding: 1rem 1.25rem;
      border-radius: 10px;
      margin-bottom: 0.85rem;
      border: 1px solid var(--border-color, #e8eaf6);
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(63, 81, 181, 0.06));
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.85rem;
    }

    .section-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e8eaf6;
    }

    .section-icon mat-icon {
      color: #3f51b5;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .payment-icon {
      background: #e8eaf6 !important;
    }
    .payment-icon mat-icon {
      color: #3f51b5 !important;
    }

    .section-title {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1a237e;
    }

    .item-count {
      margin-left: auto;
      background: #e8eaf6;
      color: #3f51b5;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.72rem;
      font-weight: 600;
    }

    .form-row {
      display: flex;
      gap: 0.6rem;
      align-items: flex-start;
    }
    .form-row mat-form-field {
      flex: 1;
    }
    .flex-2 {
      flex: 2 !important;
    }
    .full-width {
      width: 100%;
    }

    .item-header {
      display: flex;
      gap: 0.4rem;
      padding: 0.25rem 0.4rem;
      margin-bottom: 0.2rem;
      font-size: 0.7rem;
      font-weight: 600;
      color: #7986cb;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .hdr-type { width: 42px; text-align: center; }
    .hdr-desc { flex: 2; }
    .hdr-qty { flex: 0.55; text-align: center; }
    .hdr-rate { flex: 0.75; text-align: center; }
    .hdr-amount { flex: 0.85; text-align: center; }
    .hdr-action { width: 36px; }

    .item-row {
      display: flex;
      gap: 0.4rem;
      align-items: flex-start;
      margin-bottom: 0.4rem;
      padding: 0.5rem 0.6rem;
      background: var(--bg-muted, #f5f5f5);
      border-radius: 8px;
      border: 1px solid var(--border-color, #e8eaf6);
    }
    .item-row mat-form-field { flex: 1; }
    .desc-field { flex: 2 !important; }
    .qty-field { flex: 0.55 !important; }
    .rate-field { flex: 0.75 !important; }
    .amount-field { flex: 0.85 !important; }
    .remove-btn { margin-top: 2px; }

    .type-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 32px;
      border-radius: 4px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.3px;
      margin-top: 10px;
      flex-shrink: 0;
    }
    .type-badge.type-service { background: #e3f2fd; color: #1565c0; }
    .type-badge.type-inventory { background: #e8f5e9; color: #2e7d32; }

    .item-search-bar {
      margin-bottom: 0.75rem;
      position: relative;
    }
    .item-search-bar .full-width { width: 100%; }

    .search-results {
      position: absolute;
      z-index: 100;
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #c5cae9);
      border-radius: 8px;
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.12));
      max-height: 260px;
      overflow-y: auto;
      width: calc(100% - 2rem);
      margin: -0.75rem 1rem 0;
    }
    .search-result-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .search-result-item:hover { background: #e8eaf6; }
    .result-type {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 22px;
      border-radius: 4px;
      font-size: 0.6rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .result-type.type-service { background: #e3f2fd; color: #1565c0; }
    .result-type.type-inventory { background: #e8f5e9; color: #2e7d32; }
    .result-name { font-weight: 500; flex: 1; }
    .result-code { color: #7986cb; font-size: 0.8rem; }
    .result-price { font-weight: 600; color: #1a237e; }
    .result-stock { font-size: 0.75rem; color: #666; }
    .add-item-btn { margin-top: 0.35rem; }

    .compact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .mini-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: 0.6rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #1a237e;
    }
    .mini-header mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #3f51b5;
    }

    .discount-row {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .discount-input { flex: 1; }
    .discount-toggle { height: 40px; }

    .discount-applied {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.65rem;
      background: #e8eaf6;
      border-radius: 6px;
      font-size: 0.82rem;
      color: #283593;
      margin-top: 0.4rem;
      border: 1px solid #c5cae9;
    }
    .discount-applied mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #3f51b5;
    }

    .totals-col {
      padding: 0.85rem 1rem;
      background: var(--bg-muted, #f5f5f5);
      border-radius: 8px;
      border: 1px solid var(--border-color, #e8eaf6);
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.35rem 0;
      font-size: 0.88rem;
      color: var(--text-primary, #333);
    }
    .tax-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .tax-field {
      max-width: 110px;
      margin: 0;
    }
    .discount-line {
      color: #c62828;
      font-weight: 500;
    }
    .grand-total {
      border-top: 2px solid #3f51b5;
      font-size: 1.05rem;
      font-weight: 700;
      padding-top: 0.55rem;
      margin-top: 0.25rem;
      color: #1a237e;
    }

    .payment-card {
      border: 1.5px solid #c5cae9;
      background: var(--bg-muted, #f5f5f5);
    }
    .payment-summary {
      margin-top: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--bg-card, #fff);
      border-radius: 8px;
      border: 1px solid var(--border-color, #e8eaf6);
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 0;
      font-size: 0.88rem;
    }
    .balance-row {
      font-weight: 600;
      font-size: 0.95rem;
      padding-top: 0.4rem;
      border-top: 1px solid #e8eaf6;
      margin-top: 0.25rem;
    }
    .balance-row .paid {
      color: #2e7d32;
    }

    .notes-card {
      padding: 0.75rem 1.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 0.75rem;
      padding: 0.5rem 0;
    }
    .submit-btn {
      padding: 0 1.75rem;
    }
    .draft-btn {
      border-color: #c5cae9;
      color: #3f51b5;
    }

    .quick-add-btn { height: 56px; white-space: nowrap; }

    :host ::ng-deep .patient-option-item { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .patient-option-item .name { font-weight: 500; }
    :host ::ng-deep .patient-option-item .details { font-size: 0.75rem; color: #888; }
    :host ::ng-deep .quick-add-option { color: #3f51b5; font-weight: 500; }
    :host ::ng-deep .quick-add-option mat-icon { margin-right: 8px; vertical-align: middle; }

    :host ::ng-deep .mat-mdc-dialog-title { display: flex; align-items: center; gap: 0.5rem; }
    .dialog-form-row { display: flex; gap: 1rem; }
    .flex-grow { flex: 1; }

    /* Autocomplete dropdown styling */
    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important;       border: 1px solid var(--border-color, #c5cae9) !important;       box-shadow: var(--shadow-md, 0 4px 16px rgba(0,0,0,0.12)) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: #e8eaf6 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option.mat-mdc-option-active { background-color: #c5cae9 !important; }
  `]
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('quickAddDialog') quickAddDialog!: TemplateRef<any>;

  form!: FormGroup;
  quickPatientForm!: FormGroup;
  isEdit = false;
  saving = false;
  savingPatient = false;
  filteredPatients: any[] = [];
  searchTerm = '';
  showQuickAdd = false;
  allServices: ClinicalService[] = [];
  allInventoryItems: any[] = [];
  allPatients: any[] = [];
  combinedResults: any[] = [];
  availableDiscounts: any[] = [];
  subtotal = 0;
  templateDiscountValue = 0;
  manualDiscountValue = 0;
  discountValue = 0;
  taxAmount = 0;
  grandTotal = 0;
  paidAmount = 0;
  invoiceId: string | null = null;
  currencySymbol = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private tenantService: TenantService,
    private dialog: MatDialog
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      patientSearch: [''],
      itemSearch: [''],
      invoiceDate: [new Date(), Validators.required],
      dueDate: [''],
      items: this.fb.array([]),
      selectedDiscountId: [null],
      discountAmount: [0],
      discountType: ['flat'],
      taxPercentage: [0],
      notes: [''],
      paymentAmount: [0],
      paymentMethod: ['Cash', Validators.required],
      paymentReference: ['']
    });

    this.quickPatientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: [''],
      gender: [''],
      age: [null, Validators.required],
      dateOfBirth: [null]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.invoiceId = id;
    }

    this.api.get<any[]>('v1/discounts', { isActive: true }).subscribe(r => {
      this.availableDiscounts = Array.isArray(r) ? r : ((r as any)?.data ?? []);
    });

    this.form.get('discountAmount')?.valueChanges.subscribe(() => this.calculateTotals());
    this.form.get('discountType')?.valueChanges.subscribe(() => this.calculateTotals());
    this.form.get('taxPercentage')?.valueChanges.subscribe(() => this.calculateTotals());
    this.form.get('items')?.valueChanges.subscribe(() => this.calculateTotals());

    if (this.isEdit && this.invoiceId) {
      this.loadInvoice(this.invoiceId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get itemsArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  loadInvoice(id: string) {
    this.api.getById<any>('v1/invoices', id).subscribe(inv => {
      this.paidAmount = inv.paidAmount || 0;
      this.form.patchValue({
        patientId: inv.patientId,
        patientSearch: inv.patientName,
        invoiceDate: new Date(inv.invoiceDate),
        dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
        discountAmount: inv.discountAmount,
        selectedDiscountId: inv.discountId || null,
        taxPercentage: inv.taxPercent || inv.taxPercentage,
        notes: inv.notes
      });

      this.itemsArray.clear();
      inv.items?.forEach((item: any) => {
        this.itemsArray.push(this.fb.group({
          itemType: [item.itemType || 'service'],
          itemId: [item.itemId || item.serviceId || null],
          description: [item.description || ''],
          quantity: [item.quantity || 1],
          unitPrice: [item.unitPrice || 0],
          serviceTaxPercent: [item.taxPercent || 0]
        }));
      });

      if (this.itemsArray.length === 0) this.addItem();
      this.calculateTotals();
    });
  }

  onDiscountSelected() {
    const discountId = this.form.get('selectedDiscountId')?.value;
    if (discountId) {
      const discount = this.availableDiscounts.find(d => d.id === discountId);
      if (discount) {
        this.form.patchValue({
          discountType: discount.type === 'Percent' ? 'percent' : 'flat',
          discountAmount: 0
        });
      }
    }
    this.calculateTotals();
  }

  displayPatient(p: any): string {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return `${p.fullName} (${p.phone || 'No phone'})`;
  }

  onPatientSelected(e: any) {
    const patient = e.option.value;
    this.form.patchValue({ patientId: patient.id, patientSearch: patient.fullName || patient });
    this.showQuickAdd = false;
  }

  clearPatient() {
    this.form.patchValue({ patientId: '', patientSearch: '' });
  }

  onPatientFocus() {
    if (this.allPatients.length === 0) {
      this.api.get<any[]>('v1/patients/search', { limit: 1000 }).subscribe(r => {
        this.allPatients = Array.isArray(r) ? r : [];
        this.filteredPatients = this.allPatients;
      });
    }
  }

  onPatientSearchInput(event: any) {
    this.searchTerm = event.target.value || '';
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredPatients = this.allPatients;
      this.showQuickAdd = false;
      return;
    }
    this.filteredPatients = this.allPatients.filter(p =>
      (p.fullName || '').toLowerCase().includes(term) ||
      (p.phone || '').toLowerCase().includes(term) ||
      (p.mrn || '').toLowerCase().includes(term)
    );
    this.showQuickAdd = this.searchTerm.length >= 2 && this.filteredPatients.length === 0;
  }

  openQuickAddDialog() {
    this.quickPatientForm.reset({ firstName: this.searchTerm, lastName: '', phone: '', gender: '', age: null, dateOfBirth: null });
    this.dialog.open(this.quickAddDialog, { width: '550px', disableClose: true });
  }

  onAgeChange() {
    const age = this.quickPatientForm.get('age')?.value;
    if (age !== null && age !== undefined && age >= 0 && age <= 150) {
      const today = new Date();
      const dob = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
      this.quickPatientForm.get('dateOfBirth')?.setValue(dob);
    } else {
      this.quickPatientForm.get('dateOfBirth')?.setValue(null);
    }
  }

  saveQuickPatient() {
    if (this.quickPatientForm.invalid) return;
    this.savingPatient = true;

    const formVal = this.quickPatientForm.getRawValue();
    let dob = formVal.dateOfBirth;
    if (!dob && formVal.age >= 0) {
      const today = new Date();
      dob = new Date(today.getFullYear() - formVal.age, today.getMonth(), today.getDate());
    }

    const payload = {
      firstName: formVal.firstName,
      lastName: formVal.lastName || '',
      phone: formVal.phone || '',
      gender: formVal.gender || '',
      dateOfBirth: dob ? dob.toISOString() : null
    };

    this.api.post<any>('v1/opd/quick-patient', payload).subscribe({
      next: (res) => {
        this.savingPatient = false;
        this.dialog.closeAll();
        const patientData = { id: res.id, mrn: res.mrn, fullName: res.fullName, phone: res.phone };
        this.form.patchValue({ patientId: patientData.id, patientSearch: patientData.fullName });
        this.notification.success(`Patient ${patientData.fullName} created successfully`);
      },
      error: () => this.savingPatient = false
    });
  }
onItemFocus() {
  if (this.allServices.length === 0) {
    this.api.get<any[]>('v1/services/active').subscribe(res => {
      this.allServices = Array.isArray(res) ? res : ((res as any)?.data ?? []);
    });
  }
   
}
onItemSearchInput(event: any) {
  const term = (event.target.value || '').trim();
  if (!term) {
    this.combinedResults = [];
    return;
  }

  const termLower = term.toLowerCase();

  // Services: client-side filter
  const svcMapped = this.allServices
    .filter(s =>
      s.name?.toLowerCase().includes(termLower) ||
      s.code?.toLowerCase().includes(termLower)
    )
    .map(s => ({
      _type: 'service',
      _name: s.name,
      _code: s.code,
      _price: s.price,
      _tax: s.taxPercent || 0,
      _stock: null,
      _itemId: s.id
    }));

  // Inventory: dedicated search endpoint
  this.api.get<any>('v1/inventory/items/search', { term }).subscribe({
    next: (r) => {
      const items = Array.isArray(r) ? r : (r?.data ?? r?.items ?? []);
      const invMapped = items
        .filter((i: any) => i.sellingPrice > 0)
        .map((i: any) => ({
          _type: 'inventory',
          _name: i.name,
          _code: i.code,
          _price: i.sellingPrice,
          _tax: i.taxPercent || 0,
          _stock: i.currentStock,
          _itemId: i.id
        }));

      this.combinedResults = [...svcMapped, ...invMapped];
    },
    error: () => {
      this.combinedResults = svcMapped;
    }
  });
}

  onItemKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.combinedResults.length === 1) {
      event.preventDefault();
      this.addSelectedItem(this.combinedResults[0]);
    }
  }

  addSelectedItem(item: any) {
    const existing = this.itemsArray.controls.find(ctrl => 
      ctrl.value.itemType === item._type && ctrl.value.itemId === item._itemId
    );
    if (existing) {
      this.notification.warning(`${item._name} is already added to the invoice.`);
      this.combinedResults = [];
      this.form.get('itemSearch')?.setValue('', { emitEvent: false });
      return;
    }
    this.itemsArray.push(this.fb.group({
      itemType: [item._type],
      itemId: [item._itemId],
      description: [item._name],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [item._price, [Validators.required, Validators.min(0)]],
      serviceTaxPercent: [item._tax]
    }));
    this.combinedResults = [];
    this.form.get('itemSearch')?.setValue('', { emitEvent: false });
    this.calculateTotals();
  }

  displayService(s: ClinicalService): string {
    return s ? s.name : '';
  }

  onServiceSelected(e: any, index: number) {
    const service = e.option.value as ClinicalService;
    const item = this.itemsArray.at(index);
    item.patchValue({
      serviceId: service.id,
      serviceSearch: service,
      description: service.name,
      unitPrice: service.price,
      serviceTaxPercent: service.taxPercent || 0
    });
    this.calculateTotals();
  }

  addItem() {
    this.itemsArray.push(this.fb.group({
      itemType: ['service'],
      itemId: [null],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      serviceTaxPercent: [0]
    }));
  }

  removeItem(i: number) {
    this.itemsArray.removeAt(i);
    this.calculateTotals();
  }

  getItemTotal(i: number): number {
    const item = this.itemsArray.at(i).value;
    return (item.quantity || 0) * (item.unitPrice || 0);
  }

  calculateTotals() {
    this.subtotal = this.itemsArray.controls.reduce((sum, c) => {
      return sum + this.getItemTotal(this.itemsArray.controls.indexOf(c));
    }, 0);

    // Template discount
    this.templateDiscountValue = 0;
    const discountId = this.form.get('selectedDiscountId')?.value;
    if (discountId) {
      const discount = this.availableDiscounts.find(d => d.id === discountId);
      if (discount) {
        this.templateDiscountValue = discount.type === 'Percent'
          ? (this.subtotal * discount.value) / 100
          : discount.value;
        if (this.templateDiscountValue > this.subtotal) {
          this.templateDiscountValue = this.subtotal;
        }
      }
    }

    // Manual Flat / % discount
    const rawDiscount = parseFloat(this.form.get('discountAmount')?.value) || 0;
    const discountType = this.form.get('discountType')?.value || 'flat';
    let manual = discountType === 'percent'
      ? (this.subtotal * rawDiscount) / 100
      : rawDiscount;

    const remaining = this.subtotal - this.templateDiscountValue;
    if (manual < 0) manual = 0;
    if (manual > remaining) manual = remaining;
    this.manualDiscountValue = manual;

    this.discountValue = this.templateDiscountValue + this.manualDiscountValue;
    if (this.discountValue > this.subtotal) this.discountValue = this.subtotal;

    // Tax
    const taxRate = parseFloat(this.form.get('taxPercentage')?.value) || 0;
    this.taxAmount = Math.max(0, (this.subtotal - this.discountValue)) * (taxRate / 100);
    this.grandTotal = Math.max(0, this.subtotal - this.discountValue + this.taxAmount);

    // Auto-fill payment
    const maxPayment = Math.max(0, this.grandTotal);
    const currentPayment = this.form.get('paymentAmount')?.value || 0;
    if (currentPayment === 0 || currentPayment > maxPayment) {
      this.form.get('paymentAmount')?.patchValue(maxPayment, { emitEvent: false });
    }
  }

  saveAsDraft() {
    this.form.patchValue({ status: 'Draft' });
    this.submit();
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    const items = this.itemsArray.controls.map(c => {
      const v = c.value;
      return {
        itemType: v.itemType || 'service',
        itemId: v.itemId || null,
        description: v.description || '',
        quantity: Number(v.quantity) || 1,
        unitPrice: Number(v.unitPrice) || 0
      };
    });

    const data = {
      patientId: this.form.value.patientId,
      invoiceDate: this.form.value.invoiceDate || new Date(),
      dueDate: this.form.value.dueDate || null,
      items,
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      totalAmount: this.grandTotal,
      discountAmount: this.discountValue,
      discountId: this.form.value.selectedDiscountId || null,
      taxPercentage: parseFloat(this.form.get('taxPercentage')?.value) || 0,
      notes: this.form.value.notes || ''
    };

    const req = this.isEdit
      ? this.api.put('v1/invoices', this.route.snapshot.paramMap.get('id')!, data)
      : this.api.post('v1/invoices', data);

    req.subscribe({
      next: (res: any) => {
        const invoiceId = res?.id || this.invoiceId || res?.data?.id;
        const paymentAmt = Number(this.form.value.paymentAmount) || 0;

        if (paymentAmt > 0 && invoiceId) {
          const paymentData = {
            amount: Math.min(paymentAmt, this.grandTotal),
            paymentMethod: this.form.value.paymentMethod,
            referenceNumber: this.form.value.paymentReference || null,
            notes: 'Payment recorded during invoice creation'
          };
          this.api.post(`v1/invoices/${invoiceId}/payments`, paymentData).subscribe({
            next: () => {
              this.notification.success('Invoice + Payment saved');
              this.router.navigate(['/billing/invoices']);
            },
            error: () => {
              this.notification.success('Invoice saved (payment failed)');
              this.router.navigate(['/billing/invoices']);
            }
          });
        } else {
          this.notification.success('Invoice saved');
          this.router.navigate(['/billing/invoices']);
        }
      },
      error: () => {
        this.saving = false;
      }
    });
  }
}