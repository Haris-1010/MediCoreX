import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { NotificationService } from './services/notification.service';
import { SignalRService } from './services/signalr.service';
import { TenantService } from './services/tenant.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    ApiService,
    StorageService,
    NotificationService,
    SignalRService,
    TenantService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
