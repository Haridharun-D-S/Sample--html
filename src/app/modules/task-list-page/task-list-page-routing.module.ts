import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListPageComponent } from './task-list-page/task-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskListPageRoutingModule { }
