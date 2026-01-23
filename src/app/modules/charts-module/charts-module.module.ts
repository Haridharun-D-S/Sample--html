import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModuleComponent } from './charts-module.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsRoutingModule } from "./charts-module.routingmodule";
import {  ContextMenuModule} from "../context-menu/context-menu.module";
import { BarChartModule } from "src/app/modules/bar-chart/bar-chart.module";
import { GroupedandStackedChartModule } from "src/app/modules/GroupedandStacked-chart/GroupedandStacked-chart.module";
import { PieChartModule } from "src/app/modules/pie-chart/pie-chart.module";
import { ScatterChartModule } from "src/app/modules/scatter-chart/scatter-chart.module";
import { BubbleChartModule } from "src/app/modules/bubble-chart/bubble-chart.module";
import { CombinationChartModule } from 'src/app/modules/combination-chart/combination-chart.module';

@NgModule({
  declarations: [
    ChartsModuleComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    ChartsRoutingModule,
    ContextMenuModule,
    BarChartModule,
    GroupedandStackedChartModule,
    PieChartModule,
    ScatterChartModule,
    BubbleChartModule,
    CombinationChartModule
    ],
    exports: [ChartsModuleComponent ]
})
export class ChartsModule { }
