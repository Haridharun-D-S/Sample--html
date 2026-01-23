import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdDatepickerComponent } from './nd-datepicker.component';

const routes: Routes = [
  {
    path:'',
    component: NdDatepickerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdDatepickerRoutingModule { }
