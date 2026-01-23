import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryOutputComponent } from './summary-output/summary-output.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryOutputComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryOutputRoutingModule { }
