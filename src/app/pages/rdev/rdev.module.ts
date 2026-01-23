import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RdevRoutingModule } from './rdev-routing.module';
import { RdevComponent } from './rdev.component';


@NgModule({
  declarations: [
    RdevComponent
  ],
  imports: [
    CommonModule,
    RdevRoutingModule
  ]
})
export class RdevModule { }
