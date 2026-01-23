import { Component } from '@angular/core';
import { CssFormCode, HtmlFormCode, TSFormCode } from './dynamic-forms';
import { DynamicField } from './dynamic-forms/dynamic-forms.component';

@Component({
  selector: 'app-nd-dynamic-forms',
  templateUrl: './nd-dynamic-forms.component.html',
  styleUrls: ['./nd-dynamic-forms.component.scss'],
})
export class NdDynamicFormsComponent {
  html = HtmlFormCode;
  css = CssFormCode;
  ts = TSFormCode;
  selected: string = 'bs';
  formResult: any;

  set_form_field: DynamicField[] = [];
  constructor() {
    this.set_form_field = [
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
  }

  handleFormSubmit(data: any) {
    this.formResult = data;
  }


  selectedValue(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selected = value ?? 'bs'
  }

  getSubmittedForm($event: any) {
    this.formResult = $event
  }

}
