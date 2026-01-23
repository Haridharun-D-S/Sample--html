import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdDropdownComponent } from './nd-dropdown.component';

const routes: Routes = [
  {
    path:'',
    component:NdDropdownComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdDropdownRoutingModule { }
