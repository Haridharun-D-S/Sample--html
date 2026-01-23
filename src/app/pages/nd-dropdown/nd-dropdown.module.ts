import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdDropdownRoutingModule } from './nd-dropdown-routing.module';
import { NdDropdownComponent } from './nd-dropdown.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { PagesModule } from '../pages.module';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';
import { DropdownHtmlComponent } from './dropdown-html/dropdown-html.component';


@NgModule({
  declarations: [
    NdDropdownComponent,
    DropdownComponent,
    DropdownHtmlComponent
  ],
  imports: [
    CommonModule,
    NdDropdownRoutingModule,
    PagesModule,
    CommonModuleModule
  ]
})
export class NdDropdownModule { }
