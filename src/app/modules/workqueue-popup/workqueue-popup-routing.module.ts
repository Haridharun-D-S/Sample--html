import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkqueuePopupComponent } from './workqueue-popup/workqueue-popup.component';

const routes: Routes = [
  {
    path: '',
    component: WorkqueuePopupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkqueuePopupRoutingModule { }
