import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdStepperRoutingModule } from './nd-stepper-routing.module';
import { NdStepperComponent } from './nd-stepper.component';
import { CommonModuleModule } from "src/app/shared/common-module/common-module.module";
import { StepperComponent } from './stepper/stepper.component';


@NgModule({
  declarations: [
    NdStepperComponent,StepperComponent
  ],
  imports: [
    CommonModule,
    NdStepperRoutingModule,
    CommonModuleModule
],
exports:[StepperComponent]
})
export class NdStepperModule { }
