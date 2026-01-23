import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RdevComponent } from './rdev.component';

const routes: Routes = [
  {
    path:'',
    component: RdevComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RdevRoutingModule { }
