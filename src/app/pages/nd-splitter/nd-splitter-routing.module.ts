import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdSplitterComponent } from './nd-splitter.component';

const routes: Routes = [
{
    path:'',
    component: NdSplitterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdSplitterRoutingModule { }
