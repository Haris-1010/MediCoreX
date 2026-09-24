import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'platform',
    loadChildren: () => import('./features/platform/platform.module').then(m => m.PlatformModule)
  },
  {
    path: 'master',
    loadChildren: () => import('./features/master/master.module').then(m => m.MasterModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    loadChildren: () => import('./features/patients/patients.module').then(m => m.PatientsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Patients.View' }
  },
  {
    path: 'appointments',
    loadChildren: () => import('./features/appointments/appointments.module').then(m => m.AppointmentsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Appointments.View' }
  },
  {
    path: 'opd',
    loadChildren: () => import('./features/opd/opd.module').then(m => m.OpdModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'OPD.View' }
  },
  {
    path: 'ipd',
    loadChildren: () => import('./features/ipd/ipd.module').then(m => m.IpdModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'IPD.View' }
  },
  {
    path: 'emergency',
    loadChildren: () => import('./features/emergency/emergency.module').then(m => m.EmergencyModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Emergency.View' }
  },
  {
    path: 'billing',
    loadChildren: () => import('./features/billing/billing.module').then(m => m.BillingModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Billing.View' }
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.module').then(m => m.ServicesModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Services.View' }
  },
  {
    path: 'inventory',
    loadChildren: () => import('./features/inventory/inventory.module').then(m => m.InventoryModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Inventory.View' }
  },
  {
    path: 'pharmacy',
    loadChildren: () => import('./features/pharmacy/pharmacy.module').then(m => m.PharmacyModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Pharmacy.View' }
  },
  {
    path: 'laboratory',
    loadChildren: () => import('./features/laboratory/laboratory.module').then(m => m.LaboratoryModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Laboratory.View', module: 'laboratory' }
  },
  {
    path: 'radiology',
    loadChildren: () => import('./features/radiology/radiology.module').then(m => m.RadiologyModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Radiology.View', module: 'radiology' }
  },
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctors/doctors.module').then(m => m.DoctorsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Doctors.View' }
  },
  {
    path: 'departments',
    loadChildren: () => import('./features/departments/departments.module').then(m => m.DepartmentsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Departments.View' }
  },
  {
    path: 'prescriptions',
    loadChildren: () => import('./features/prescriptions/prescriptions.module').then(m => m.PrescriptionsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Prescriptions.View' }
  },
  {
    path: 'facility',
    loadChildren: () => import('./features/facility/facility.module').then(m => m.FacilityModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Facility.View' }
  },
  {
    path: 'wards',
    loadChildren: () => import('./features/wards/wards.module').then(m => m.WardsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Wards.View' }
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Reports.View' }
  },
  {
    path: 'insurance',
    loadChildren: () => import('./features/insurance/insurance.module').then(m => m.InsuranceModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Insurance.View' }
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard, permissionGuard],
    data: { permission: 'Settings.View' }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
