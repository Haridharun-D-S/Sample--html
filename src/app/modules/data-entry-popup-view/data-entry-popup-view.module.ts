import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataEntryPopupViewRoutingModule } from './data-entry-popup-view-routing.module';
import { DataEntryPopupViewComponent } from './data-entry-popup-view/data-entry-popup-view.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DataEntryModule } from '../data-entry/data-entry.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DataEntryPopupViewComponent
  ],
  imports: [
    CommonModule,
    DataEntryPopupViewRoutingModule,
    MaterialModule,
    DataEntryModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class DataEntryPopupViewModule { }
