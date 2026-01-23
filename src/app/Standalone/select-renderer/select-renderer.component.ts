import { Component } from '@angular/core';
import { NgClass,NgFor,NgStyle } from '@angular/common';
import { ICellRendererParams } from "@ag-grid-community/core";
interface CustomButtonParams extends ICellRendererParams {
  onClick: (params: any) => void;
}
@Component({
  selector: 'app-select-renderer',
  standalone: true,
  imports: [NgClass,NgStyle,NgFor],
  templateUrl: './select-renderer.component.html',
  styleUrls: ['./select-renderer.component.scss']
})
export class SelectRendererComponent {
  public value!: any;
  public color;
  params: any;
  public dropdownSelectedValue;
  onClick!: (params: any) => void;
  dropDownData: any;
  agInit(params): void {
    this.params = params;
    this.onClick = params.onClick
    this.value = params;
    this.dropDownData = params.ownerDropdown
    //  this.color = params.data.iconColor;
    this.color = params.data.actionColour
  }
  refresh(params: CustomButtonParams) {
    return true;
  }
  buttonClicked() {
  }
  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    // Emit the selected value to the parent component or handle it as needed
    this.params.setValue(selectedValue, this.params.data.Case_ID, this.params.data.Task_ID);
  }
}
