import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { HeaderAppsModule } from 'src/app/layouts/header-apps/header-apps.module';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ClientSideGridComponent,
    HeaderAppsModule
  ]
})
export class ReportsModule { }
