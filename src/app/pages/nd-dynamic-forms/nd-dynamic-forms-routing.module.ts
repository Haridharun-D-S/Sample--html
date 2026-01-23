import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdDynamicFormsComponent } from './nd-dynamic-forms.component';

const routes: Routes = [
  {
    path: '',
    component: NdDynamicFormsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NdDynamicFormsRoutingModule {}
