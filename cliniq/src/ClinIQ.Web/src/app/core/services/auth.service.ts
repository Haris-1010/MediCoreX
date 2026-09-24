import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { SignalRService } from './signalr.service';
import { PermissionService } from './permission.service';

export interface BranchMembership {
  branchId: string;
  branchName: string;
  isPrimary: boolean;
}

export interface TenantMembership {
  tenantId: string;
  tenantName: string;
  isOwner: boolean;
  roles: string[];
  branches: BranchMembership[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  isSuperAdmin: boolean;
  isMaster: boolean;
  tenants: TenantMembership[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organizationName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/v1/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private signalR: SignalRService,
    private permissions: PermissionService
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = this.storage.getItem<string>(environment.tokenKey);
    const user = this.storage.getItem<User>(environment.userKey);

    if (!token || !user) {
      return;
    }

    if (!this.isTokenExpired(token)) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      this.signalR.startConnection(token);
      this.permissions.load(true).subscribe();
      return;
    }

    this.clearAuth();
  }

  login(request: LoginRequest, useApi = false): Observable<LoginResponse> {
    if (!environment.production && !useApi) {
      const demoUser: User = {
        id: 'dev-admin',
        email: request.email,
        firstName: 'Developer',
        lastName: 'Admin',
        profilePictureUrl: null,
        isSuperAdmin: true,
        isMaster: false,
        tenants: [
          {
            tenantId: 'dev-tenant',
            tenantName: 'Development Tenant',
            isOwner: true,
            roles: ['Admin', 'SuperAdmin'],
            branches: [
              { branchId: 'dev-branch', branchName: 'Development Branch', isPrimary: true }
            ]
          }
        ]
      };

      const response: LoginResponse = {
        accessToken: 'dev-access-token',
        refreshToken: 'dev-refresh-token',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: demoUser
      };

      this.handleAuthentication(response);
      return of(response);
    }

    return this.http.post<{ succeeded: boolean; data: LoginResponse }>(`${this.baseUrl}/login`, request)
      .pipe(
        map(response => response.data),
        tap(response => this.handleAuthentication(response)),
        catchError(error => throwError(() => error))
      );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }

  logout(): void {
    const refreshToken = this.storage.getItem<string>(environment.refreshTokenKey);

    if (refreshToken) {
      this.http.post(`${this.baseUrl}/logout`, { refreshToken }).subscribe();
    }

    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.storage.getItem<string>(environment.refreshTokenKey);
    const accessToken = this.storage.getItem<string>(environment.tokenKey);

    if (!refreshToken || !accessToken) {
      this.clearAuth();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ succeeded: boolean; data: LoginResponse }>(`${this.baseUrl}/refresh-token`, {
      accessToken,
      refreshToken
    }).pipe(
      map(response => response.data),
      tap(response => this.handleAuthentication(response)),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, {
      token,
      email,
      password,
      confirmPassword
    });
  }

  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
  }

  getToken(): string | null {
    return this.storage.getItem<string>(environment.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private normalizeValue(value: unknown): string {
    return String(value ?? '').trim().toLowerCase();
  }

  private getNormalizedPermissions(user: User | null): string[] {
    if (!user) return [];

    const directPermissions = [
      ...(Array.isArray((user as any).permissions) ? (user as any).permissions : []),
      ...(Array.isArray((user as any).roles) ? (user as any).roles : [])
    ];

    const tenantPermissions = (user.tenants ?? []).flatMap(t => t.roles ?? []);
    return [...directPermissions, ...tenantPermissions]
      .map(value => this.normalizeValue(value))
      .filter(Boolean);
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    const requiredPermission = this.normalizeValue(permission);
    const permissions = this.getNormalizedPermissions(user);
    return permissions.includes(requiredPermission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    const normalized = permissions.map(p => this.normalizeValue(p));
    const availablePermissions = this.getNormalizedPermissions(user);
    return normalized.some(p => availablePermissions.includes(p));
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    const requiredRole = this.normalizeValue(role);
    const tenantRoles = (user.tenants ?? []).flatMap(t => t.roles ?? []);
    const allRoles = [...tenantRoles, ...((user as any).roles ?? [])].map(r => this.normalizeValue(r));
    return allRoles.includes(requiredRole);
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    const requiredRoles = roles.map(r => this.normalizeValue(r));
    const tenantRoles = (user.tenants ?? []).flatMap(t => t.roles ?? []);
    const allRoles = [...tenantRoles, ...((user as any).roles ?? [])].map(r => this.normalizeValue(r));
    return requiredRoles.some(r => allRoles.includes(r));
  }

  switchBranch(branchId: string): Observable<LoginResponse> {
    return this.http.post<{ succeeded: boolean; data: LoginResponse }>(`${this.baseUrl}/switch-branch`, { branchId })
      .pipe(
        map(response => response.data),
        tap(response => this.handleAuthentication(response, branchId))
      );
  }

  private handleAuthentication(response: LoginResponse, preferredBranchId?: string): void {
    this.storage.setItem(environment.tokenKey, response.accessToken);
    this.storage.setItem(environment.refreshTokenKey, response.refreshToken);
    this.storage.setItem(environment.userKey, response.user);

    // Store first tenant / selected branch if available
    const firstTenant = response.user.tenants?.[0];
    if (firstTenant) {
      this.storage.setItem(environment.tenantKey, firstTenant.tenantId);

      if (preferredBranchId === 'all') {
        this.storage.setItem(environment.branchKey, 'all');
      } else if (preferredBranchId) {
        this.storage.setItem(environment.branchKey, preferredBranchId);
      } else {
        const primaryBranch = firstTenant.branches?.find(b => b.isPrimary) || firstTenant.branches?.[0];
        if (primaryBranch) {
          this.storage.setItem(environment.branchKey, primaryBranch.branchId);
        }
      }
    }

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);

    this.signalR.startConnection(response.accessToken);

    // Load the effective permission context for the new session so the UI
    // (sidebar, buttons, guards) reflects the user's real grants.
    this.permissions.load(true).subscribe();
  }

  private clearAuth(): void {
    this.storage.removeItem(environment.tokenKey);
    this.storage.removeItem(environment.refreshTokenKey);
    this.storage.removeItem(environment.userKey);
    this.storage.removeItem(environment.tenantKey);
    this.storage.removeItem(environment.branchKey);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    this.signalR.stopConnection();
    this.permissions.clear();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry;
    } catch {
      return true;
    }
  }
}
