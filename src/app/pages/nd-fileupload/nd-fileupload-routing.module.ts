import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdFileuploadComponent } from './nd-fileupload.component';

const routes: Routes = [
  {
    path:'',
    component: NdFileuploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdFileuploadRoutingModule { }
