import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseActionPageComponent } from './base-action-page/base-action-page.component';

const routes: Routes = [
  {
    path: '',
    component: BaseActionPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseActionPageRoutingModule { }
