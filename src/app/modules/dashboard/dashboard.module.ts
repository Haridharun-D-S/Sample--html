import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { InitWidgetDirective, InitWidgetDirectiveModule } from "src/app/shared/directives/init-widget.directive";
import { EcareModalComponent } from "./ecare-modal/ecare-modal.component";
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import {  WidgetModule } from "../widget/widget-chart.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainDashboardComponent } from "./main-dashboard/main-dashboard.component";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule,MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatChipsModule } from '@angular/material/chips';
import { SharedCoreModule } from "src/app/modules/shared-module/shared.module";
import { HeaderAppsModule } from "src/app/layouts/header-apps/header-apps.module";
import { WorkQueueModule } from "src/app/modules/work-queue/work-queue.module";
//import { NgxSliderModule } from '@angular-slider/ngx-slider';

// import {
//   MatButtonModule,
//   MatFormFieldModule,
//   MatInputModule,
//   MatRippleModule
// } from '@angular/material';
import { ClientSideGridComponent } from '../../Standalone/client-side-grid/client-side-grid.component';
@NgModule({
  declarations: [
    DashboardComponent,
    EcareModalComponent,
    MainDashboardComponent
    ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    DashboardRoutingModule,
    DragDropModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    InitWidgetDirectiveModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,MatNativeDateModule,MatDatepickerModule,MatChipsModule,
    SharedCoreModule,
    HeaderAppsModule,
    ClientSideGridComponent,
    WorkQueueModule
    ],
    exports: [DashboardComponent , 
       MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatRippleModule,MatNativeDateModule,MatDatepickerModule,MatChipsModule,
    ],
    providers: [DatePipe]
})
export class DashboardModule { }
