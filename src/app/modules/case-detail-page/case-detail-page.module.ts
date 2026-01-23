import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseDetailPageRoutingModule } from './case-detail-page-routing.module';
import { CaseDetailPageComponent } from './case-detail-page/case-detail-page.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateConvertPipeModule } from 'src/app/shared/pipe/date-convert-pipe';
import { FilterPipeModule } from 'src/app/shared/pipe/searchpipe';


@NgModule({
  declarations: [
    CaseDetailPageComponent
  ],
  imports: [
    CommonModule,
    CaseDetailPageRoutingModule,
    MaterialModule,
    ClientSideGridComponent,
    FormsModule,
    ReactiveFormsModule,
    DateConvertPipeModule,
    FilterPipeModule
  ],
  exports:[
    CaseDetailPageComponent
  ]
})
export class CaseDetailPageModule { }
