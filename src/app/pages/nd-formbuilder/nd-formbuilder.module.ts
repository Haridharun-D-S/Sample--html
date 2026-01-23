import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdFormbuilderRoutingModule } from './nd-formbuilder-routing.module';
import { NdFormbuilderComponent } from './nd-formbuilder.component';
import { FormbuilderComponent } from './formbuilder/formbuilder.component';


@NgModule({
  declarations: [
    NdFormbuilderComponent,
    FormbuilderComponent,
  ],
  imports: [
    CommonModule,
    NdFormbuilderRoutingModule
  ],
  exports: [NdFormbuilderComponent]
})
export class NdFormbuilderModule { }
