import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdHILRoutingModule } from './nd-hil-routing.module';
import { NdHILComponent } from '../nd-hil/nd-hil.component';
import { HILComponent } from './hil/hil.component';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';


@NgModule({
  declarations: [
    NdHILComponent,
    HILComponent
  ],
  imports: [
    CommonModule,
    NdHILRoutingModule,
    CommonModuleModule
  ]
})
export class NdHILModule { }
