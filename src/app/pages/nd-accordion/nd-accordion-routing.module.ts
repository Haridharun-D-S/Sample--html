import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdAccordionComponent } from './nd-accordion.component';

const routes: Routes = [{
  path: '',
  component: NdAccordionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdAccordionRoutingModule { }
