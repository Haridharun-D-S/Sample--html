import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseActionPageRoutingModule } from './base-action-page-routing.module';
import { BaseActionPageComponent } from './base-action-page/base-action-page.component';
import { DataEntryModule } from '../data-entry/data-entry.module';
import { RecordListingModule } from '../record-listing/record-listing.module';
import { SummaryOutputModule } from '../summary-output/summary-output.module';
import { HeaderAppsModule } from 'src/app/layouts/header-apps/header-apps.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { CaseDetailPageModule } from '../case-detail-page/case-detail-page.module';


@NgModule({
  declarations: [
    BaseActionPageComponent
  ],
  imports: [
    CommonModule,
    BaseActionPageRoutingModule,
    DataEntryModule,
    RecordListingModule,
    SummaryOutputModule,
    CaseDetailPageModule,
    HeaderAppsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class BaseActionPageModule { }
