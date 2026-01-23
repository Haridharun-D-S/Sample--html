import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
export interface Step {
  label: string;
  icon: string;
}
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  @Input() steps: Step[] = [];
  @Input() currentStepIndex = 0;

  @Output() stepChange = new EventEmitter<number>();

  ngOnChanges() {
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = 0;
    }
  }

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.stepChange.emit(this.currentStepIndex);
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.stepChange.emit(this.currentStepIndex);
    }
  }

  selectStep(index: number) {
    this.currentStepIndex = index;
    this.stepChange.emit(index);
  }

}
