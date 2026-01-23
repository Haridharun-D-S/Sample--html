export const htmlstepperCode = `<div class="stepper-container">
    <button class="arrow-btn" [disabled]="currentStepIndex === 0" (click)="prev()">
        <i class="fa fa-angle-double-left"></i>
    </button>

    <div class="steps">
        <div *ngFor="let step of steps; let i = index" class="step" [class.active]="i === currentStepIndex"
            [class.completed]="i < currentStepIndex" (click)="selectStep(i)">
            <div class="icon">
                <i [class]="step.icon"></i>
            </div>
            <div class="label">{{ step.label }}</div>
            <div *ngIf="i < steps.length - 1" class="connector"></div>
        </div>
    </div>

    <button class="arrow-btn" [disabled]="currentStepIndex === steps.length - 1" (click)="next()">
        <i class="fa fa-angle-double-right"></i>
    </button>
</div>`;
export const cssstepperCode = `.stepper-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .arrow-btn {
    background-color: #bfbfbf;
    border: none;
    color: #fff;
    width: 38px;
    height: 38px;
    border-radius: 6px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease-in-out;

    &:hover:not(:disabled) {
      background-color: #888;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    i {
      pointer-events: none;
    }
  }

  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    position: relative;
    margin: 0 20px;
 

    .step {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      min-width: 80px;

      .icon {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background-color: #a5a5a5;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        z-index: 2;
        transition: all 0.3s ease;
      }

      .label {
        margin-top: 6px;
        font-size: 13px;
        color: #7a7a7a;
        font-weight: 500;
        white-space: nowrap;
      }

      .connector {
        position: absolute;
        top: 35%;
        right: -80px;
        width: 120px;
        height: 3px;
        background-color: #cfcfcf;
        transform: translateY(-50%);
        z-index: 1;
      }

      &.active {
        .icon {
          background-color: #5cb85c; // green active
          transform: scale(1.05);
        }
        .label {
          color: #5cb85c;
          font-weight: 600;
        }
      }

      &.completed {
        .icon {
          background-color: #f0ad4e; // orange completed
        }
        .label {
          color: #f0ad4e;
          font-weight: 600;
        }

        .connector {
          background-color: #f0ad4e;
        }
      }
    }
    .step:not(:last-child) {
      margin-right: 10px;
    }
  }
}
`;
export const tsstepperCode = `import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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
`;