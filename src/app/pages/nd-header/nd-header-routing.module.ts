import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdHeaderComponent } from './nd-header.component';

const routes: Routes = [
  {
    path:'',
    component: NdHeaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdHeaderRoutingModule { }
