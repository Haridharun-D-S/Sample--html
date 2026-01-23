import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordListingComponent } from './record-listing/record-listing.component';

const routes: Routes = [
  {
    path: '',
    component: RecordListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordListingRoutingModule { }
