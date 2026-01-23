import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdAccordionRoutingModule } from './nd-accordion-routing.module';
import { PagesModule } from '../pages.module';
import { AccordionComponent } from './accordion/accordion.component';
import { NdAccordionComponent } from './nd-accordion.component';

@NgModule({
  declarations: [NdAccordionComponent, AccordionComponent],
  imports: [CommonModule, NdAccordionRoutingModule, PagesModule],
})
export class NdAccordionModule {}
