import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseListPageComponent } from './case-list-page/case-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: CaseListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseListPageRoutingModule { }
