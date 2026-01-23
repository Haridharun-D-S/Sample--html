import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdHILComponent } from './nd-hil.component';

const routes: Routes = [
  {
    path:'',
    component:NdHILComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdHILRoutingModule { }
