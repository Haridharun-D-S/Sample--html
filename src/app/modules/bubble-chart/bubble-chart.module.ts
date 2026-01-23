import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BubbleChartRoutingModule } from './bubble-chart-routing.module';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from "src/app/modules/context-menu/context-menu.module";

@NgModule({
  declarations: [
    BubbleChartComponent
  ],
  imports: [
    CommonModule,
    BubbleChartRoutingModule,
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    FormsModule,
    ContextMenuModule
  ],
  exports:[BubbleChartComponent]
})
export class BubbleChartModule { }
