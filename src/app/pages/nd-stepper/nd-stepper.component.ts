import { Component } from '@angular/core';
import { Step } from './stepper/stepper.component';
import { cssstepperCode, htmlstepperCode, tsstepperCode } from './stepperCode';

@Component({
  selector: 'app-nd-stepper',
  templateUrl: './nd-stepper.component.html',
  styleUrls: ['./nd-stepper.component.scss']
})
export class NdStepperComponent {
    htmlstepperCode = htmlstepperCode;
    cssstepperCode = cssstepperCode;
    tsstepperCode = tsstepperCode;
 activeStep = 0;

  // Dynamically loaded from API, config, or local JSON
  stepData: Step[] = [
    { label: 'Details', icon: 'fa fa-list' },
    { label: 'Version', icon: 'fa fa-code-branch' },
    { label: 'Criteria', icon: 'fa fa-wrench' },
    { label: 'Threshold', icon: 'fa fa-random' },
    { label: 'Associations', icon: 'fa fa-user-plus' },
    { label: 'Aggregation', icon: 'fa fa-users' },
    { label: 'Docs/Tags', icon: 'fa fa-paperclip' },
    { label: 'Run', icon: 'fa fa-upload' },
    { label: 'Schedule Measure', icon: 'fa fa-calendar-check-o' }
  ];

  onStepChange(index: number) {
    this.activeStep = index;
   
  }
  copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
}
