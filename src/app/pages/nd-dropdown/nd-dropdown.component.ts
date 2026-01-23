import { Component } from '@angular/core';
import { cssDropdownCode, htmlDropdownCode, tsDropdownCode } from './dropDownCode';

@Component({
  selector: 'app-nd-dropdown',
  templateUrl: './nd-dropdown.component.html',
  styleUrls: ['./nd-dropdown.component.scss']
})
export class NdDropdownComponent {

    htmlDropdownCode = htmlDropdownCode;
    cssDropdownCode = cssDropdownCode;
    tsDropdownCode = tsDropdownCode;

  copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
}
