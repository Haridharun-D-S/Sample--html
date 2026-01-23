import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdModalComponent } from './nd-modal.component';

const routes: Routes = [
  {
    path: '',
    component: NdModalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NdModalRoutingModule {}
