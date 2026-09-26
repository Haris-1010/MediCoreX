import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';
import { ClinicalService } from '../../services/models/service.model';
import { PatientPickerComponent, PatientPickerValue } from '../../../shared/components/patient-picker/patient-picker.component';

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
              <app-patient-picker
                #patientPicker
                label="Patient"
                [required]="true"
                (patientChange)="onPatientChange($event)">
              </app-patient-picker>

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
                       autocomplete="off"
                       (focus)="onItemFocus()"
                       (blur)="closeItemResults()"
                       (input)="onItemSearchInput($event)"
                       (keydown)="onItemKeydown($event)">
                <mat-icon matPrefix>search</mat-icon>
                <mat-spinner matSuffix *ngIf="itemSearching" diameter="18"></mat-spinner>
              </mat-form-field>

              <!-- mousedown is swallowed so clicking a row does not blur the input first -->
              <div class="search-panel" *ngIf="itemPanelOpen" (mousedown)="$event.preventDefault()">
                <div class="panel-scroll" #resultScroll>
                <ng-container *ngFor="let group of resultGroups">
                  <div class="panel-group" *ngIf="group.items.length > 0">
                    <div class="group-label">
                      <mat-icon>{{ group.icon }}</mat-icon>
                      <span>{{ group.label }}</span>
                      <span class="group-count">{{ group.items.length }}</span>
                    </div>
                    <div class="result-row" *ngFor="let r of group.items"
                         [class.active]="combinedResults.indexOf(r) === activeResultIndex"
                         (mouseenter)="activeResultIndex = combinedResults.indexOf(r)"
                         (click)="addSelectedItem(r)">
                      <div class="result-avatar" [class]="'result-avatar av-' + r._type">
                        <mat-icon>{{ r._type === 'service' ? 'medical_services' : 'medication' }}</mat-icon>
                      </div>
                      <div class="result-main">
                        <div class="result-name">
                          <ng-container *ngFor="let part of highlightParts(r._name)">
                            <mark *ngIf="part.match">{{ part.text }}</mark><ng-container *ngIf="!part.match">{{ part.text }}</ng-container>
                          </ng-container>
                        </div>
                        <div class="result-meta">
                          <span class="result-code" *ngIf="r._code">{{ r._code }}</span>
                          <span class="result-sub" *ngIf="r._subtitle">{{ r._subtitle }}</span>
                        </div>
                      </div>
                      <div class="result-side">
                        <span class="result-price">{{ r._price | currencyFormat }}</span>
                        <span class="stock-pill" *ngIf="r._stock !== null" [class]="'stock-pill ' + stockClass(r)">
                          {{ r._stockStatus === 'OutOfStock' ? 'Out of stock' : (r._stock + ' in stock') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </ng-container>
                </div>

                <div class="panel-empty" *ngIf="!itemSearching && combinedResults.length === 0">
                  <mat-icon>search_off</mat-icon>
                  <div>
                    <div class="empty-title">No matches for "{{ itemSearchTerm }}"</div>
                    <div class="empty-sub">Try a name, code or generic name</div>
                  </div>
                </div>

                <div class="panel-footer" *ngIf="combinedResults.length > 0">
                  <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                  <span><kbd>Enter</kbd> add</span>
                  <span><kbd>Esc</kbd> close</span>
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

    .item-search-bar mat-spinner { margin-right: 10px; }

    .search-panel {
      position: absolute;
      top: 56px;
      left: 0;
      right: 0;
      z-index: 100;
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14), 0 2px 6px rgba(15, 23, 42, 0.06);
      overflow: hidden;
      animation: panel-in 0.14s ease-out;
    }
    @keyframes panel-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .panel-scroll {
      max-height: 340px;
      overflow-y: auto;
    }
    .panel-group { padding: 0 6px 6px; }
    .panel-group + .panel-group { border-top: 1px solid var(--border-color, #e2e8f0); }
    .group-label {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 8px 6px;
      background: var(--bg-card, #fff);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--text-muted, #64748b);
    }
    .group-label mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .group-count {
      margin-left: auto;
      padding: 1px 7px;
      border-radius: 10px;
      background: var(--bg-badge, #f5f5f5);
      color: var(--text-secondary, #475569);
      font-size: 0.66rem;
      letter-spacing: 0;
    }

    .result-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 10px;
      border-radius: 8px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: background 0.12s, border-color 0.12s;
    }
    .result-row.active {
      background: var(--bg-hover, #f1f5f9);
      border-left-color: var(--accent-primary, #667eea);
    }
    .result-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      flex-shrink: 0;
    }
    .result-avatar mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .av-service { background: rgba(33, 150, 243, 0.12); color: #1e88e5; }
    .av-inventory { background: rgba(76, 175, 80, 0.14); color: #2e7d32; }

    .result-main { flex: 1; min-width: 0; }
    .result-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary, #1e293b);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .result-name mark {
      background: rgba(102, 126, 234, 0.18);
      color: inherit;
      border-radius: 3px;
      padding: 0 1px;
    }
    .result-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
      font-size: 0.74rem;
      color: var(--text-muted, #64748b);
      min-width: 0;
    }
    .result-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      padding: 0 6px;
      border-radius: 4px;
      background: var(--bg-badge, #f5f5f5);
      color: var(--text-secondary, #475569);
      flex-shrink: 0;
    }
    .result-sub { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .result-side {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
      flex-shrink: 0;
    }
    .result-price {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text-primary, #1e293b);
      font-variant-numeric: tabular-nums;
    }
    .stock-pill {
      padding: 1px 8px;
      border-radius: 10px;
      font-size: 0.68rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .stock-in { background: rgba(76, 175, 80, 0.14); color: #2e7d32; }
    .stock-low { background: rgba(255, 152, 0, 0.16); color: #b26a00; }
    .stock-out { background: rgba(244, 67, 54, 0.14); color: #c62828; }

    .panel-empty {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 16px;
      color: var(--text-muted, #64748b);
    }
    .panel-empty mat-icon { font-size: 28px; width: 28px; height: 28px; opacity: 0.7; }
    .empty-title { font-weight: 600; color: var(--text-primary, #1e293b); font-size: 0.88rem; }
    .empty-sub { font-size: 0.76rem; margin-top: 2px; }

    .panel-footer {
      display: flex;
      gap: 16px;
      padding: 7px 14px;
      border-top: 1px solid var(--border-color, #e2e8f0);
      background: var(--bg-primary, #f5f5f5);
      font-size: 0.7rem;
      color: var(--text-muted, #64748b);
    }
    .panel-footer kbd {
      display: inline-block;
      min-width: 18px;
      margin-right: 3px;
      padding: 0 4px;
      border: 1px solid var(--border-color, #e2e8f0);
      border-bottom-width: 2px;
      border-radius: 4px;
      background: var(--bg-card, #fff);
      font-family: inherit;
      font-size: 0.66rem;
      text-align: center;
    }
    @media (max-width: 600px) {
      .panel-footer { display: none; }
      .result-row { gap: 10px; padding: 8px 6px; }
    }

    :host-context(.dark-theme) .av-service { color: #64b5f6; }
    :host-context(.dark-theme) .av-inventory,
    :host-context(.dark-theme) .stock-in { color: #81c784; }
    :host-context(.dark-theme) .stock-low { color: #ffb74d; }
    :host-context(.dark-theme) .stock-out { color: #e57373; }
    :host-context(.dark-theme) .result-name mark { background: rgba(129, 140, 248, 0.28); }
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

    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important;       border: 1px solid var(--border-color, #c5cae9) !important;       box-shadow: var(--shadow-md, 0 4px 16px rgba(0,0,0,0.12)) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: #e8eaf6 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option.mat-mdc-option-active { background-color: #c5cae9 !important; }
  `]
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('patientPicker') patientPicker!: PatientPickerComponent;

  form!: FormGroup;
  isEdit = false;
  saving = false;
  allServices: ClinicalService[] = [];
  allInventoryItems: any[] = [];
  allPatients: any[] = [];
  combinedResults: any[] = [];
  itemSearchTerm = '';
  itemSearching = false;
  itemPanelOpen = false;
  activeResultIndex = -1;
  private itemSearchSeq = 0;
  @ViewChild('resultScroll') resultScroll?: ElementRef<HTMLElement>;
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
    private tenantService: TenantService
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit() {
    this.form = this.fb.group({
      patientId: [''],
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
        invoiceDate: new Date(inv.invoiceDate),
        dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
        discountAmount: inv.discountAmount,
        selectedDiscountId: inv.discountId || null,
        taxPercentage: inv.taxPercent || inv.taxPercentage,
        notes: inv.notes
      });

      if (inv.patientId) {
        this.api.getById<any>('v1/patients', inv.patientId).subscribe(p => {
          this.patientPicker?.setPatient({
            id: p.id,
            mrn: p.mrn,
            fullName: p.fullName || inv.patientName || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
            phone: p.phone
          });
        });
      }

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

  onPatientChange(patient: PatientPickerValue | null) {
    this.form.patchValue({ patientId: patient?.id || '' });
  }

  onItemFocus() {
  if (this.allServices.length === 0) {
    this.api.get<any[]>('v1/services/active', { type: 1 }).subscribe(res => {
      this.allServices = Array.isArray(res) ? res : ((res as any)?.data ?? []);
    });
  }
  // Coming back to a field that still has a term: show its results again.
  if ((this.form.get('itemSearch')?.value || '').trim()) {
    this.itemPanelOpen = true;
    this.activeResultIndex = this.combinedResults.length > 0 ? 0 : -1;
  }
}
onItemSearchInput(event: any) {
  const term = (event.target.value || '').trim();
  this.itemSearchTerm = term;
  this.activeResultIndex = -1;
  const seq = ++this.itemSearchSeq;
  if (!term) {
    this.combinedResults = [];
    this.itemSearching = false;
    this.itemPanelOpen = false;
    return;
  }

  const termLower = term.toLowerCase();

  // Services: client-side filter (only General type, exclude Lab/Radiology)
  const svcMapped = this.allServices
    .filter(s => s.type === 1)
    .filter(s =>
      s.name?.toLowerCase().includes(termLower) ||
      s.code?.toLowerCase().includes(termLower)
    )
    .map(s => ({
      _type: 'service',
      _name: s.name,
      _code: s.code,
      _subtitle: null,
      _price: s.price,
      _tax: s.taxPercent || 0,
      _stock: null,
      _stockStatus: null,
      _itemId: s.id
    }));

  // Show matching services right away; inventory follows from the API.
  this.combinedResults = svcMapped;
  this.itemSearching = true;
  this.itemPanelOpen = true;

  // Inventory: dedicated search endpoint
  this.api.get<any>('v1/inventory/items/search', { term }).subscribe({
    next: (r) => {
      if (seq !== this.itemSearchSeq) return; // a newer keystroke owns the panel
      const items = Array.isArray(r) ? r : (r?.data ?? r?.items ?? []);
      const invMapped = items
        .filter((i: any) => i.sellingPrice > 0)
        .map((i: any) => ({
          _type: 'inventory',
          _name: i.name,
          _code: i.code,
          _subtitle: i.genericName || i.brandName || null,
          _price: i.sellingPrice,
          _tax: i.taxPercent || 0,
          _stock: i.currentStock,
          _stockStatus: i.stockStatus,
          _itemId: i.id
        }));

      this.combinedResults = [...svcMapped, ...invMapped];
      this.activeResultIndex = this.combinedResults.length > 0 ? 0 : -1;
      this.itemSearching = false;
    },
    error: () => {
      if (seq !== this.itemSearchSeq) return;
      this.combinedResults = svcMapped;
      this.activeResultIndex = svcMapped.length > 0 ? 0 : -1;
      this.itemSearching = false;
    }
  });
}

  get resultGroups() {
    return [
      { label: 'Services', icon: 'medical_services', items: this.combinedResults.filter(r => r._type === 'service') },
      { label: 'Inventory items', icon: 'inventory_2', items: this.combinedResults.filter(r => r._type === 'inventory') }
    ];
  }

  highlightParts(text: string): { text: string; match: boolean }[] {
    const term = this.itemSearchTerm;
    if (!text || !term) return [{ text: text || '', match: false }];
    const at = text.toLowerCase().indexOf(term.toLowerCase());
    if (at < 0) return [{ text, match: false }];
    return [
      { text: text.slice(0, at), match: false },
      { text: text.slice(at, at + term.length), match: true },
      { text: text.slice(at + term.length), match: false }
    ].filter(p => p.text);
  }

  stockClass(r: any): string {
    if (r._stockStatus === 'OutOfStock') return 'stock-out';
    if (r._stockStatus === 'LowStock') return 'stock-low';
    return 'stock-in';
  }

  closeItemResults() {
    this.itemPanelOpen = false;
    this.activeResultIndex = -1;
  }

  onItemKeydown(event: KeyboardEvent) {
    const count = this.combinedResults.length;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        if (!count) return;
        event.preventDefault();
        this.itemPanelOpen = true;
        const step = event.key === 'ArrowDown' ? 1 : -1;
        this.activeResultIndex = (this.activeResultIndex + step + count) % count;
        this.scrollActiveIntoView();
        break;
      case 'Enter':
        if (!this.itemPanelOpen || !count) return;
        event.preventDefault();
        this.addSelectedItem(this.combinedResults[Math.max(this.activeResultIndex, 0)]);
        break;
      case 'Escape':
        if (this.itemPanelOpen) {
          event.preventDefault();
          this.closeItemResults();
        }
        break;
    }
  }

  private scrollActiveIntoView() {
    setTimeout(() => {
      this.resultScroll?.nativeElement
        .querySelector('.result-row.active')
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  addSelectedItem(item: any) {
    const existing = this.itemsArray.controls.find(ctrl => 
      ctrl.value.itemType === item._type && ctrl.value.itemId === item._itemId
    );
    if (existing) {
      this.notification.warning(`${item._name} is already added to the invoice.`);
      this.combinedResults = [];
      this.closeItemResults();
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
    this.closeItemResults();
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

  async submit() {
    if (this.saving) return;
    const patient = await this.patientPicker?.ensurePatient();
    if (!patient && !this.form.value.patientId) {
      this.notification.error('Please select or create a patient');
      return;
    }
    if (patient) this.form.patchValue({ patientId: patient.id });
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