import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreDetailsComponent } from './explore-details/explore-details.component';

const routes: Routes = [
  {
        path: '',
        component: ExploreDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreDetailsRoutingModule { }
