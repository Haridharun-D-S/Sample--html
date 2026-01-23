import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseDetailPageComponent } from './case-detail-page/case-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: CaseDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseDetailPageRoutingModule { }
