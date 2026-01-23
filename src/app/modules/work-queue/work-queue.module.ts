import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkQueueRoutingModule } from './work-queue-routing.module';
import { WorkQueueComponent } from './work-queue/work-queue.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ClientSideGridComponent } from "src/app/Standalone/client-side-grid/client-side-grid.component";
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    WorkQueueComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    WorkQueueRoutingModule,
    ClientSideGridComponent,
    MatProgressSpinnerModule,
    MaterialModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[WorkQueueComponent]
})
export class WorkQueueModule { }
