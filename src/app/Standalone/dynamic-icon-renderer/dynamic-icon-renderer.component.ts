import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from "@ag-grid-community/core";
import { NgIf, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-dynamic-icon-renderer',
  standalone: true,
  imports: [NgIf,NgClass,NgStyle],
  templateUrl: './dynamic-icon-renderer.component.html',
  styleUrls: ['./dynamic-icon-renderer.component.scss']
})
export class DynamicIconRendererComponent implements ICellRendererAngularComp {
 // Init Cell Value
 public value!: string;
 public icon!: string;
 public color;
 agInit(params): void {
   const value = params.value.split('~');
   this.value = value[0];
   this.icon = value[1];   
   this.color = value[2];
 }

 // Return Cell Value
 refresh(params): boolean {
   const value = params.value.split('~');
   this.value = value[0];
   this.icon = value[1];
     return true;
 }
}
