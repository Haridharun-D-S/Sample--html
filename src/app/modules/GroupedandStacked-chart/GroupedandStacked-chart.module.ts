import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupedandStackedChartComponent } from './GroupedandStacked-chart/GroupedandStacked-chart.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { GroupedandStackedChartRoutingModule } from "./GroupedandStacked-chart.routing.module";
import { ContextMenuModule } from "src/app/modules/context-menu/context-menu.module";

@NgModule({
  declarations: [
    GroupedandStackedChartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    GroupedandStackedChartRoutingModule,
    ContextMenuModule
    ],
    exports:[GroupedandStackedChartComponent]
})
export class GroupedandStackedChartModule { }
