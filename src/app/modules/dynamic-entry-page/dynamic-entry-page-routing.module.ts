import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicEntryPageComponent } from './dynamic-entry-page/dynamic-entry-page.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicEntryPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicEntryPageRoutingModule { }
