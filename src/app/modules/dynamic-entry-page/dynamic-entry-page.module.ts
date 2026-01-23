import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicEntryPageRoutingModule } from './dynamic-entry-page-routing.module';
import { DynamicEntryPageComponent } from './dynamic-entry-page/dynamic-entry-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { DateConvertPipeModule } from 'src/app/shared/pipe/date-convert-pipe';
import { FilterPipeModule } from 'src/app/shared/pipe/searchpipe';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';

@NgModule({
  declarations: [
    DynamicEntryPageComponent,
  ],
  imports: [
    CommonModule,
    DynamicEntryPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DateConvertPipeModule,
    FilterPipeModule,
    ClientSideGridComponent
  ],
  exports: [
    DynamicEntryPageComponent,
   
  ]
})
export class DynamicEntryPageModule { }
