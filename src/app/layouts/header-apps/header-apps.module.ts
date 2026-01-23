import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderAppsRoutingModule } from './header-apps-routing.module';
import { HeaderAppsComponent } from './header-apps.component';
import {SharedCoreModule  } from "src/app/modules/shared-module/shared.module";
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  declarations: [
    HeaderAppsComponent
  ],
  imports: [
    CommonModule,
    HeaderAppsRoutingModule,
    SharedCoreModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  exports:[HeaderAppsComponent]
})
export class HeaderAppsModule { }