import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileExplorerHighlightComponent } from './file-explorer-highlight/file-explorer-highlight.component';

const routes: Routes = [
  {
    path: '',
    component: FileExplorerHighlightComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileExplorerHighlightRoutingModule { }
