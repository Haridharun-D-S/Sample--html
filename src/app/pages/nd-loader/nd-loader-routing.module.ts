import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdLoaderComponent } from './nd-loader.component';

const routes: Routes = [
    {
      path:'',
      component: NdLoaderComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdLoaderRoutingModule { }
