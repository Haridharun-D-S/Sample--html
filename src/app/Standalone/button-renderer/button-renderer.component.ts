import { Component } from '@angular/core';
import { NgClass,NgFor,NgStyle } from '@angular/common';
import { ICellRendererParams } from "@ag-grid-community/core";
interface CustomButtonParams extends ICellRendererParams {
  onClick: (params: any) => void;
}

@Component({
  selector: 'app-button-renderer',
  standalone: true,
  imports: [NgClass,NgStyle,NgFor],
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})
export class ButtonRendererComponent {
  public value!: any;
  params: any;
  public dropdownSelectedValue;
  onClick!: (params: any) => void;
  dropDownData: any;
  agInit(params): void {
    this.params = params;
    this.onClick = params.onClick
    this.value = params;
  }
  refresh(params: CustomButtonParams) {
    this.value = params;
    this.params = params;
    return true;
  }
}
