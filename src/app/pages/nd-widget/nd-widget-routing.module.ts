import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetsComponent } from './widgets/widgets.component';
import { NdWidgetComponent } from './nd-widget.component';

const routes: Routes = [
  {
    path:'',
    component: NdWidgetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdWidgetRoutingModule { }
