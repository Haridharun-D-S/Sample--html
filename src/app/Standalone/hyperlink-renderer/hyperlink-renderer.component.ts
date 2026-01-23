import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from "@ag-grid-community/core";
import { NgIf, NgClass, NgStyle } from '@angular/common';
interface CustomButtonParams extends ICellRendererParams {
  onClick: (params: any) => void;
  onClick2: (params: any) => void;
}
@Component({
  selector: 'app-hyperlink-renderer',
  standalone: true,
  imports: [NgIf,NgClass,NgStyle],
  templateUrl: './hyperlink-renderer.component.html',
  styleUrls: ['./hyperlink-renderer.component.scss']
})
export class HyperlinkRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: any;
  public parsedValue!: string;
  public icon!: string;
  public columnName!: string;
  onClick!: (params: any) => void;
  onClick2!: (params: any) => void;
  agInit(params: CustomButtonParams): void {
    this.onClick = params.onClick
    this.onClick2 = params.onClick2
    this.value = params;
    this.columnName = params.column.getColId();
    this.icon = params.data ? params.data.hyperlinkIcon : '';
  }

  // Return Cell Value
  refresh(params: CustomButtonParams): boolean {
    this.value = params;
    this.icon = params.data ? params.data.hyperlinkIcon : '';
    return true;
  }
}
