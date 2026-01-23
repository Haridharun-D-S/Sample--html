import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileMainDashboardComponent } from './file-main-dashboard/file-main-dashboard.component';

const routes: Routes = [
  {
      path: '',
      component: FileMainDashboardComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileListDashboardRoutingModule { }
