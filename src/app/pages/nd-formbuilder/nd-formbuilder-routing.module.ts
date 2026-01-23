import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdFormbuilderComponent } from './nd-formbuilder.component';

const routes: Routes = [
  {
    path:'',
    component:NdFormbuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdFormbuilderRoutingModule { }
