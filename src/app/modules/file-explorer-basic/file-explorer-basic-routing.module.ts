import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileExplorerBasicComponent } from './file-explorer-basic/file-explorer-basic.component';

const routes: Routes = [
  {
    path: '',
    component: FileExplorerBasicComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileExplorerBasicRoutingModule { }
