import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './widget/widget.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { WidgetRoutingModule } from "./widget.routing.module";
import { ChartsModule } from "src/app/modules/charts-module/charts-module.module";

@NgModule({
  declarations: [
    WidgetComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    ChartModule,
    WidgetRoutingModule,
    ChartsModule
    ],
    exports: [ WidgetComponent]
})
export class WidgetModule { }
