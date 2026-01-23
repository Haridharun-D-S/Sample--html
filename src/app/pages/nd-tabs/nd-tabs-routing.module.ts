import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdTabsComponent } from './nd-tabs.component';

const routes: Routes = [
  {
    path:'',
    component:NdTabsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdTabsRoutingModule { }
