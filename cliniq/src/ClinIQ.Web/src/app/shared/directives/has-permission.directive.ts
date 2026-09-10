import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
} from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';

/**
 * Structural directive that removes UI the user cannot act on.
 *
 *   <button *hasPermission="'patients.create'">New Patient</button>
 *   <button *hasPermission="'billing.refund'; module: 'billing'">Refund</button>
 *   <a *hasPermission="['billing.edit','billing.create']; mode: 'any'">Edit</a>
 *
 * Removing the element is presentation, not protection. Every action behind one
 * of these is independently rejected by its own API endpoint.
 */
@Directive({
  selector: '[hasPermission], [appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissions = inject(PermissionService);

  private required: string[] = [];
  private module?: string;
  private mode: 'all' | 'any' = 'all';
  private rendered = false;

  constructor() {
    // Re-evaluates when the permission context changes, so a branch switch
    // updates the UI without a reload.
    effect(() => {
      this.permissions.current();
      this.update();
    });
  }

  @Input()
  set hasPermission(value: string | string[]) {
    this.required = Array.isArray(value) ? value : [value];
    this.update();
  }

  @Input()
  set appHasPermission(value: string | string[]) {
    this.hasPermission = value;
  }

  @Input()
  set hasPermissionModule(value: string | undefined) {
    this.module = value;
    this.update();
  }

  @Input()
  set appHasPermissionModule(value: string | undefined) {
    this.hasPermissionModule = value;
  }

  @Input()
  set hasPermissionMode(value: 'all' | 'any') {
    this.mode = value ?? 'all';
    this.update();
  }

  @Input()
  set appHasPermissionMode(value: 'all' | 'any') {
    this.hasPermissionMode = value;
  }

  private update(): void {
    const moduleOk = !this.module || this.permissions.hasModule(this.module);
    const permOk =
      this.required.length === 0 ||
      (this.mode === 'any'
        ? this.permissions.hasAny(this.required)
        : this.permissions.hasAll(this.required));

    const allowed = moduleOk && permOk;

    if (allowed && !this.rendered) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.rendered = true;
    } else if (!allowed && this.rendered) {
      this.viewContainer.clear();
      this.rendered = false;
    }
  }
}
