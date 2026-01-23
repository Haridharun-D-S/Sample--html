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
