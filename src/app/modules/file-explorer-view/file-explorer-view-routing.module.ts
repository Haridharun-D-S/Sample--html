import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileExplorerViewComponent } from './file-explorer-view/file-explorer-view.component';

const routes: Routes = [
  {
    path: '',
    component: FileExplorerViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileExplorerViewRoutingModule { }
