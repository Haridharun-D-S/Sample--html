import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdDatepickerRoutingModule } from './nd-datepicker-routing.module';
import { NdDatepickerComponent } from './nd-datepicker.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { PagesModule } from '../pages.module';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';


@NgModule({
  declarations: [
    NdDatepickerComponent,
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    NdDatepickerRoutingModule,
    PagesModule,
    CommonModuleModule
  ],
  exports:[DatepickerComponent]
})
export class NdDatepickerModule { }
