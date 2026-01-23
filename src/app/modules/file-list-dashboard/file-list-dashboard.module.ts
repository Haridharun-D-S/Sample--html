import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FileListDashboardRoutingModule } from './file-list-dashboard-routing.module';
import { FileDashboardComponent } from './file-dashboard/file-dashboard.component';
import { FileMainDashboardComponent } from './file-main-dashboard/file-main-dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WidgetModule } from '../widget/widget-chart.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCoreModule } from '../shared-module/shared.module';
import { HeaderAppsModule } from 'src/app/layouts/header-apps/header-apps.module';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { WorkQueueModule } from '../work-queue/work-queue.module';
import { InitWidgetDirectiveModule } from 'src/app/shared/directives/init-widget.directive';


@NgModule({
  declarations: [
    FileDashboardComponent,
    FileMainDashboardComponent
  ],
  imports: [
    CommonModule,
    FileListDashboardRoutingModule,
    HighchartsChartModule,
    ChartModule,
    DragDropModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    InitWidgetDirectiveModule,
    MatInputModule,
    MatRippleModule,MatNativeDateModule,MatDatepickerModule,MatChipsModule,
    SharedCoreModule,
    HeaderAppsModule,
    ClientSideGridComponent,
    WorkQueueModule
  ],
  exports: [FileDashboardComponent , 
         MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,MatNativeDateModule,MatDatepickerModule,MatChipsModule,
      ],
      providers: [DatePipe]
})
export class FileListDashboardModule { }
