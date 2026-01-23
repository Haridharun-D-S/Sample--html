import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAppsModule } from 'src/app/layouts/header-apps/header-apps.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientSideGridComponent } from "src/app/Standalone/client-side-grid/client-side-grid.component";
import { MaterialModule } from 'src/app/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WorkQueueModule } from "src/app/modules/work-queue/work-queue.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskListPageRoutingModule } from './task-list-page-routing.module';
import { TaskListPageComponent } from './task-list-page/task-list-page.component';


@NgModule({
  declarations: [
    TaskListPageComponent
  ],
  imports: [
    CommonModule,
    TaskListPageRoutingModule,
    HeaderAppsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    ClientSideGridComponent,
    MaterialModule,
    WorkQueueModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ]
})
export class TaskListPageModule { }
