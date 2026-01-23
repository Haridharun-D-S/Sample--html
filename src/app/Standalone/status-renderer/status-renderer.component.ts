import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from "@ag-grid-community/core";
import { NgIf, NgClass, NgStyle } from '@angular/common';
interface CustomButtonParams extends ICellRendererParams {
  onClick: (params: any) => void;
}
@Component({
  selector: 'app-status-renderer',
  standalone: true,
  imports: [NgIf,NgClass,NgStyle],
  templateUrl: './status-renderer.component.html',
  styleUrls: ['./status-renderer.component.scss']
})
export class StatusRendererComponent implements ICellRendererAngularComp {

 // Init Cell Value
 public value!: string;
 public icon!: string;
 public color;
 public params;
 onClick!: (params: any) => void;
 agInit(params: CustomButtonParams): void {
   this.onClick = params.onClick
   this.params = params;
   this.icon = params.data.statusIcon;
   this.value = params.value;
   this.color = params.data.statusIconColour
 }

 // Return Cell Value
 refresh(params: CustomButtonParams): boolean {
  this.icon = params.data.statusIcon;
  this.value = params.value;
   return true;
 }

}
