import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ScatterChartComponent } from './scatter-chart/scatter-chart.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedCoreRoutingModule {}
