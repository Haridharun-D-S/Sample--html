import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdStepperComponent } from './nd-stepper.component';

const routes: Routes = [
     {
        path:'',
        component: NdStepperComponent
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdStepperRoutingModule { }
