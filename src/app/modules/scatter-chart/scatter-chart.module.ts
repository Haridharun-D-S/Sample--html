import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterChartComponent } from './scatter-chart/scatter-chart.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ScatterChartRoutingModule } from "./scatter-chart.routing.module";
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from "src/app/modules/context-menu/context-menu.module";

@NgModule({
  declarations: [
    ScatterChartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    ScatterChartRoutingModule,
    FormsModule,
    ContextMenuModule
    ],
    exports:[ScatterChartComponent]
})
export class ScatterChartModule { }
