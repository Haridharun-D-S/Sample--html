import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdToasterRoutingModule } from './nd-toaster-routing.module';
import { NdToasterComponent } from './nd-toaster.component';
import { ToasterComponent } from './toaster/toaster.component';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';
import { ToastService } from './toaster/toaster.service';


@NgModule({
  declarations: [
    NdToasterComponent,
    ToasterComponent
  ],
  imports: [
    CommonModule,
    NdToasterRoutingModule,
    CommonModuleModule
  ],
  exports:[NdToasterComponent],
  providers:[ToastService]
})
export class NdToasterModule { }
