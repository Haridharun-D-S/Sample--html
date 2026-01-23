import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from "@ag-grid-community/core";
import { NgClass,NgStyle } from '@angular/common';
interface CustomButtonParams extends ICellRendererParams {
  onClick: (params: any) => void;
}
@Component({
  selector: 'app-action-renderer',
  standalone: true,
  imports: [NgClass,NgStyle],
  templateUrl: './action-renderer.component.html',
  styleUrls: ['./action-renderer.component.scss']
})
export class ActionRendererComponent implements ICellRendererAngularComp {
  public value!: any;
  public color;
  onClick!: (params: any) => void;
  agInit(params: CustomButtonParams): void {
    this.onClick = params.onClick
    this.value = params;
    this.color = params.data.actionColour
  }
  refresh(params: CustomButtonParams) {
    return true;
  }
  buttonClicked() {
  }

}
