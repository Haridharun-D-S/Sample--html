import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { BarChartRoutingModule } from "./bar-chart.routing.module";
import {  ContextMenuModule} from "../context-menu/context-menu.module";
@NgModule({
  declarations: [
    BarChartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    BarChartRoutingModule,
    ContextMenuModule
    ],
    exports: [BarChartComponent ]
})
export class BarChartModule { }
