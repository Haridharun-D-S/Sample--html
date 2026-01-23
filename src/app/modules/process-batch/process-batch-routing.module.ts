import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessBatchComponent } from './process-batch.component';

const routes: Routes = [
    {
        path: '',
        component: ProcessBatchComponent
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessBatchRoutingModule { }
