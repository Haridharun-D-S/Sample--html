import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataEntryPopupViewComponent } from './data-entry-popup-view/data-entry-popup-view.component';

const routes: Routes = [
  {
    path: '',
    component: DataEntryPopupViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEntryPopupViewRoutingModule { }
