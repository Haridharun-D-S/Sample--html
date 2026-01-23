import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsightsRoutingModule } from './insights-routing.module';
import { InsightsComponent } from './insights/insights.component';
import { HeaderAppsModule } from 'src/app/layouts/header-apps/header-apps.module';
import { DashboardModule } from '../dashboard/dashboard.module';


@NgModule({
  declarations: [
    InsightsComponent
  ],
  imports: [
    CommonModule,
    InsightsRoutingModule,
    HeaderAppsModule,
    DashboardModule
  ]
})
export class InsightsModule { }
