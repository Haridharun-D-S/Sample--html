import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupedandStackedChartComponent } from './GroupedandStacked-chart/GroupedandStacked-chart.component';

const routes: Routes = [
  {
    path: '',
    component: GroupedandStackedChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupedandStackedChartRoutingModule {}
