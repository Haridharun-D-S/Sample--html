import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { PieChartRoutingModule } from "./pie-chart.routing.module";
import { ContextMenuModule } from "src/app/modules/context-menu/context-menu.module";
@NgModule({
  declarations: [
    PieChartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    PieChartRoutingModule,
    ContextMenuModule
    ],
    exports:[PieChartComponent]
})
export class PieChartModule { }
