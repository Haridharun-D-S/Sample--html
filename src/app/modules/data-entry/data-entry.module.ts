import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataEntryRoutingModule } from './data-entry-routing.module';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataEntryDetailsComponent } from './data-entry-details/data-entry-details.component';
import { FileExplorerHighlightModule } from '../file-explorer-highlight/file-explorer-highlight.module';
import { DynamicEntryPageModule } from '../dynamic-entry-page/dynamic-entry-page.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedCoreModule } from '../shared-module/shared.module';


@NgModule({
  declarations: [
    DataEntryComponent,
    DataEntryDetailsComponent
  ],
  imports: [
    CommonModule,
    DataEntryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileExplorerHighlightModule,
    DynamicEntryPageModule,
    MaterialModule,
    SharedCoreModule
  ],
  exports: [
    DataEntryComponent
  ],
  providers: [
  ]
})
export class DataEntryModule { }
