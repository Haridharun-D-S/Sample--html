import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CombinationChartRoutingModule } from './combination-chart-routing.module';
import { CombinationChartComponent } from './combination-chart/combination-chart.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from "src/app/modules/context-menu/context-menu.module";

@NgModule({
  declarations: [
    CombinationChartComponent
  ],
  imports: [
    CommonModule,
    CombinationChartRoutingModule,
    ChartModule,
    HighchartsChartModule,
    FormsModule,
    ContextMenuModule
  ],
  exports:[CombinationChartComponent]
})
export class CombinationChartModule { }
