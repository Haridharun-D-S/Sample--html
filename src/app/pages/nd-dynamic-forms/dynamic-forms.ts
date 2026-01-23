export const HtmlFormCode = `
<form [formGroup]="form" (ngSubmit)="submit()" *ngIf="type == 'bs'">
    <div class="row">
        <ng-container *ngFor="let field of fields">
            <div [class]="'col-md-' + field.colSpan + ' mb-3'">

                <label class="form-label">{{ field.label }}</label>

                <!-- INPUT -->
                <input *ngIf="['text','email','number','date','password'].includes(field.type)" class="form-control"
                    [type]="field.type" [formControlName]="field.key" >

                <!-- TEXTAREA -->
                <textarea *ngIf="field.type === 'textarea'" class="form-control" [formControlName]="field.key"
                   ></textarea>

                <!-- SELECT -->
                <select *ngIf="field.type === 'select'" class="form-select" [formControlName]="field.key">
                    <option value="">Select</option>
                    <option *ngFor="let opt of field.options" [value]="opt.value">
                        {{ opt.label }}
                    </option>
                </select>

                <!-- RADIO -->
                <div *ngIf="field.type === 'radio'">
                    <div *ngFor="let opt of field.options">
                        <input type="radio" [value]="opt.value" [formControlName]="field.key">
                        {{ opt.label }}
                    </div>
                </div>

                <select *ngIf="field.type === 'multiselect'" class="form-select" multiple [formControlName]="field.key">
                    <option *ngFor="let opt of field.options" [value]="opt.value">
                        {{ opt.label }}
                    </option>
                </select>

                <div *ngIf="field.type === 'checkbox'" class="form-check">
                    <input type="checkbox" class="form-check-input" [formControlName]="field.key">
                    <label class="form-check-label">{{ field.label }}</label>
                </div>
                <input *ngIf="field.type === 'file'" type="file" class="form-control"
                    (change)="onFileChange($event, field.key)">
                <!-- ERROR -->
                <small class="text-danger" *ngIf="form.get(field.key)?.touched && form.get(field.key)?.invalid">
                    {{ field.label }} is invalid
                </small>
            </div>
        </ng-container>
    </div>
    <button class="btn btn-primary mt-3">Submit</button>
</form>

<form [formGroup]="form" (ngSubmit)="submit()" *ngIf="type == 'material'">
    <div class="row">

        <ng-container *ngFor="let field of fields">
            <div [class]="'col-md-' + (field.colSpan ?? 12) + ' mb-3'" *ngIf="field.visible !== false">

                <!-- LABEL -->
                <mat-form-field appearance="outline" class="w-100"
                    *ngIf="['text','email','number','password','date','textarea'].includes(field.type)">

                    <mat-label>{{ field.label }}</mat-label>

                    <!-- INPUT -->
                    <input matInput *ngIf="field.type !== 'textarea' && field.type !== 'date'" [type]="field.type"
                        [formControlName]="field.key" >

                    <!-- DATE -->
                    <input matInput *ngIf="field.type === 'date'" [matDatepicker]="picker" [formControlName]="field.key"
                       >
                    <mat-datepicker-toggle matSuffix [for]="picker" *ngIf="field.type === 'date'">
                    </mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>

                    <!-- TEXTAREA -->
                    <textarea matInput *ngIf="field.type === 'textarea'" rows="3" [formControlName]="field.key" >
          </textarea>

                    <!-- ERROR -->
                    <mat-error *ngIf="form.get(field.key)?.touched && form.get(field.key)?.invalid">
                        {{ field.label }} is invalid
                    </mat-error>

                </mat-form-field>

                <!-- SELECT -->
                <mat-form-field appearance="outline" class="w-100" *ngIf="field.type === 'select'">
                    <mat-label>{{ field.label }}</mat-label>
                    <mat-select [formControlName]="field.key">
                        <mat-option *ngFor="let opt of field.options" [value]="opt.value">
                            {{ opt.label }}
                        </mat-option>
                    </mat-select>
                    <mat-error *ngIf="form.get(field.key)?.touched && form.get(field.key)?.invalid">
                        {{ field.label }} is required
                    </mat-error>
                </mat-form-field>

                <!-- MULTI SELECT -->
                <mat-form-field appearance="outline" class="w-100" *ngIf="field.type === 'multiselect'">
                    <mat-label>{{ field.label }}</mat-label>
                    <mat-select multiple [formControlName]="field.key">
                        <mat-option *ngFor="let opt of field.options" [value]="opt.value">
                            {{ opt.label }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>

                <!-- RADIO -->
                <div *ngIf="field.type === 'radio'" class="mb-2">
                    <label class="fw-semibold d-block mb-1">{{ field.label }}</label>
                    <mat-radio-group [formControlName]="field.key">
                        <mat-radio-button class="me-3" *ngFor="let opt of field.options" [value]="opt.value">
                            {{ opt.label }}
                        </mat-radio-button>
                    </mat-radio-group>
                </div>

                <!-- CHECKBOX -->
                <div *ngIf="field.type === 'checkbox'" class="mt-2">
                    <mat-checkbox [formControlName]="field.key">
                        {{ field.label }}
                    </mat-checkbox>
                </div>

                <!-- FILE -->
                <div *ngIf="field.type === 'file'" class="mt-2">
                    <label class="d-block mb-1">{{ field.label }}</label>
                    <input type="file" class="form-control" (change)="onFileChange($event, field.key)">
                </div>

            </div>
        </ng-container>

    </div>

    <button mat-raised-button color="primary" class="mt-3" type="submit">
        Submit
    </button>
</form>
`
export const CssFormCode = `
input[readonly], textarea[readonly] {
  background-color: #f5f5f5;
}
`
export const TSFormCode = `

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export interface DynamicOption {
  label: string;
  value: any;
}

export interface DynamicValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  email?: boolean;
  pattern?: string;
}

export interface DynamicCondition {
  field: string;
  value: any;
}

export interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' |
  'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'multiselect';

  value?: any;
  options?: DynamicOption[];
  validations?: DynamicValidation;

  sequence: number;
  colSpan?: number;

  disabled?: boolean;
  readonly?: boolean;

  visible?: boolean;
  showWhen?: DynamicCondition;
  disableWhen?: DynamicCondition;
  readonlyWhen?: DynamicCondition;

  permissions?: string[]; // role-based
}

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
})
export class DynamicFormsComponent implements OnInit {
  form!: FormGroup;
  fields: DynamicField[] = [];

  @Input() type: string = 'bs'; // 'bootstrap' | 'material' 
  @Input() FORM_CONFIG: DynamicField[] = [];
  @Output() Submitted = new EventEmitter<any>();
  userRole = 'ADMIN';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fields = this.FORM_CONFIG
      .filter((f: any) => !f.permissions || f.permissions.includes(this.userRole))
      .sort((a: { sequence: number; }, b: { sequence: number; }) => a.sequence - b.sequence);

    this.createForm();
    this.applyConditions();
  }

  createForm() {
    const group: any = {};

    this.fields.forEach(field => {
      const validators = [];

      const v = field.validations;
      if (v?.required) validators.push(Validators.required);
      if (v?.minLength) validators.push(Validators.minLength(v.minLength));
      if (v?.maxLength) validators.push(Validators.maxLength(v.maxLength));
      if (v?.min) validators.push(Validators.min(v.min));
      if (v?.max) validators.push(Validators.max(v.max));
      if (v?.email) validators.push(Validators.email);
      if (v?.pattern) validators.push(Validators.pattern(v.pattern));

      group[field.key] = this.fb.control(
        { value: field.value ?? '', disabled: field.disabled ?? false },
        validators
      );
    });

    this.form = this.fb.group(group);
  }

  applyConditions() {
    this.form.valueChanges.subscribe(() => {
      this.fields.forEach(field => {

      // VISIBILITY
      if (field.showWhen) {
        field.visible =
          this.form.get(field.showWhen.field)?.value === field.showWhen.value;
      } else {
        field.visible = true;
      }

      // DISABLE / ENABLE
      if (field.disableWhen) {
        const ctrl = this.form.get(field.key);
        const shouldDisable =
          this.form.get(field.disableWhen.field)?.value === field.disableWhen.value;

        if (shouldDisable && ctrl?.enabled) {
          ctrl.disable({ emitEvent: false });
        }

        if (!shouldDisable && ctrl?.disabled) {
          ctrl.enable({ emitEvent: false });
        }
      }

      // READONLY
      if (field.readonlyWhen) {
        field.readonly =
          this.form.get(field.readonlyWhen.field)?.value === field.readonlyWhen.value;
      }
      });
    });
  }

  onFileChange(event: Event, key: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.get(key)?.setValue(file);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.Submitted.emit(this.form.getRawValue())
  }
}


// Example Input JSON

[
      // TEXT (Conditional)
      {
        key: 'adminCode',
        label: 'Admin Code',
        type: 'text',
        sequence: 2,
        colSpan: 2,
        showWhen: { field: 'role', value: 'ADMIN' },
        validations: { required: true }
      },

      // TEXT
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        sequence: 1,
        colSpan: 4,
        validations: { required: true, minLength: 3 }
      },

      // EMAIL
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        sequence: 3,
        colSpan: 3,
        readonly: true,
        validations: { email: true }
      },

      // DROPDOWN
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        sequence: 4,
        colSpan: 3,
        options: [
          { label: 'Admin', value: 'ADMIN' },
          { label: 'User', value: 'USER' }
        ],
        validations: { required: true }
      },

      // DISABLED TEXT
      {
        key: 'employeeId',
        label: 'Employee ID',
        type: 'text',
        sequence: 5,
        colSpan: 3,
        disabled: true
      },

      // TEXTAREA (Readonly conditional)
      {
        key: 'comments',
        label: 'Comments',
        type: 'textarea',
        sequence: 6,
        colSpan: 3,
        readonlyWhen: { field: 'role', value: 'USER' }
      },

      // RADIO
      {
        key: 'gender',
        label: 'Gender',
        type: 'radio',
        sequence: 7,
        colSpan: 3,
        options: [
          { label: 'Male', value: 'M' },
          { label: 'Female', value: 'F' }
        ],
        validations: { required: true }
      },

      // DATE
      {
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        sequence: 8,
        colSpan: 3,
        validations: { required: true }
      },

      // NUMBER
      {
        key: 'experience',
        label: 'Experience (Years)',
        type: 'number',
        sequence: 9,
        colSpan: 3,
        validations: { min: 0, max: 40 }
      },

      // MULTI SELECT
      {
        key: 'skills',
        label: 'Skills',
        type: 'multiselect',
        sequence: 10,
        colSpan: 3,
        options: [
          { label: 'Angular', value: 'angular' },
          { label: 'React', value: 'react' },
          { label: 'NodeJS', value: 'node' },
          { label: 'NestJS', value: 'nest' }
        ]
      },

      //CHECKBOX
      {
        key: 'acceptTerms',
        label: 'Accept Terms',
        type: 'checkbox',
        sequence: 11,
        colSpan: 3,
        validations: { required: true }
      },

      // PASSWORD
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        sequence: 12,
        colSpan: 3,
        validations: { required: true, minLength: 6 }
      },

      // FILE
      {
        key: 'resume',
        label: 'Resume',
        type: 'file',
        sequence: 13,
        colSpan: 3
      }
    ]

`