import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryOutputRoutingModule } from './summary-output-routing.module';
import { SummaryOutputComponent } from './summary-output/summary-output.component';
import { FileExplorerViewModule } from '../file-explorer-view/file-explorer-view.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileExplorerBasicModule } from '../file-explorer-basic/file-explorer-basic.module';
@NgModule({
  declarations: [
    SummaryOutputComponent
  ],
  imports: [
    CommonModule,
    SummaryOutputRoutingModule,
    FileExplorerViewModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    FileExplorerBasicModule
  ],
  exports: [
    SummaryOutputComponent
  ]
})
export class SummaryOutputModule { }
