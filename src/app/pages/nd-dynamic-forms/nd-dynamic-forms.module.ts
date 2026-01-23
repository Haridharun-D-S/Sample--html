import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdDynamicFormsRoutingModule } from './nd-dynamic-forms-routing.module';
import { NdDynamicFormsComponent } from './nd-dynamic-forms.component';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';
import { PagesModule } from '../pages.module';

@NgModule({
  declarations: [NdDynamicFormsComponent, DynamicFormsComponent],
  imports: [
    CommonModule,
    NdDynamicFormsRoutingModule,
    CommonModuleModule,
    PagesModule,
  ],
  exports: [DynamicFormsComponent],
})
export class NdDynamicFormsModule {}
