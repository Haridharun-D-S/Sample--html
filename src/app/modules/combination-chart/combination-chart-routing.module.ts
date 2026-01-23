import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CombinationChartComponent } from './combination-chart/combination-chart.component'
const routes: Routes = [
  {
    path: '',
    component: CombinationChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CombinationChartRoutingModule { }
