import { Component } from '@angular/core';

interface FormElement {
  id: string;
  type: string;
  fieldName: string;
  label: string;
  placeholder: string;
}

interface FormData {
  [key: string]: any;
}

@Component({
  selector: 'app-nd-formbuilder',
  templateUrl: './nd-formbuilder.component.html',
  styleUrls: ['./nd-formbuilder.component.scss']
})
export class NdFormbuilderComponent {
  draggedElement: any = null;
  elementCounter: number = 0;
  formElements: FormElement[] = [];
  showCodeModal: boolean = false;
  generatedCode: string = '';

  constructor() {}

  // Drag start event handler
  onDragStart(event: DragEvent): void {
    this.draggedElement = (event.target as HTMLElement).closest('.draggable-item');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  // Drag over event handler
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const canvas = document.getElementById('formCanvas');
    if (canvas) {
      canvas.classList.add('drag-over');
    }
  }

  // Drag leave event handler
  onDragLeave(event: DragEvent): void {
    const canvas = document.getElementById('formCanvas');
    if (canvas && event.target === canvas) {
      canvas.classList.remove('drag-over');
    }
  }

  // Drop event handler
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const canvas = document.getElementById('formCanvas');
    if (canvas) {
      canvas.classList.remove('drag-over');
    }

    if (this.draggedElement && this.draggedElement.classList.contains('draggable-item')) {
      const type = this.draggedElement.getAttribute('data-type');
      this.addFormElement(type);
    }
  }

  // Add form element to canvas
  addFormElement(type: string): void {
    const canvas = document.getElementById('formCanvas');
    if (canvas) {
      canvas.classList.remove('empty');
    }

    const id = `element-${this.elementCounter++}`;
    const fieldName = this.getDefaultFieldName(type);
    const label = this.getDefaultLabel(type);
    const placeholder = this.getDefaultPlaceholder(type);

    const formElement: FormElement = {
      id,
      type,
      fieldName,
      label,
      placeholder
    };

    this.formElements.push(formElement);
  }

  // Get default field name based on type
  getDefaultFieldName(type: string): string {
    const names: { [key: string]: string } = {
      'text': 'textInput',
      'email': 'emailInput',
      'tel': 'phoneInput',
      'textarea': 'message',
      'select': 'dropdown',
      'checkbox': 'checkboxGroup',
      'radio': 'radioGroup',
      'date': 'dateInput'
    };
    return names[type] || 'field';
  }

  // Get default label based on type
  getDefaultLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'text': 'Text Input',
      'email': 'Email Input',
      'tel': 'Phone Input',
      'textarea': 'Text Area',
      'select': 'Dropdown',
      'checkbox': 'Checkbox',
      'radio': 'Radio Button',
      'date': 'Date Picker'
    };
    return labels[type] || 'Field';
  }

  // Get default placeholder based on type
  getDefaultPlaceholder(type: string): string {
    const placeholders: { [key: string]: string } = {
      'text': 'Enter text...',
      'email': 'Enter email...',
      'tel': 'Enter phone number...',
      'textarea': 'Enter your message...'
    };
    return placeholders[type] || '';
  }

  // Toggle config panel for element
  toggleConfig(element: FormElement): void {
    const configPanel = document.getElementById(`config-${element.id}`);
    if (configPanel) {
      // Close other open configs
      document.querySelectorAll('.field-config.active').forEach(panel => {
        if (panel.id !== `config-${element.id}`) {
          panel.classList.remove('active');
        }
      });
      configPanel.classList.toggle('active');
    }
  }

  // Save configuration changes
  saveConfig(element: FormElement): void {
    const fieldNameInput = document.querySelector(`#config-${element.id} .field-name`) as HTMLInputElement;
    const labelInput = document.querySelector(`#config-${element.id} .field-label`) as HTMLInputElement;
    const placeholderInput = document.querySelector(`#config-${element.id} .field-placeholder`) as HTMLInputElement;

    const fieldName = fieldNameInput?.value.trim() || '';
    const label = labelInput?.value.trim() || '';
    const placeholder = placeholderInput?.value.trim() || '';

    if (!fieldName || !label) {
      alert('Field name and label are required!');
      return;
    }

    // Update element
    element.fieldName = fieldName;
    element.label = label;
    element.placeholder = placeholder;

    // Close config panel
    const configPanel = document.getElementById(`config-${element.id}`);
    if (configPanel) {
      configPanel.classList.remove('active');
    }
  }

  // Cancel configuration changes
  cancelConfig(element: FormElement): void {
    const configPanel = document.getElementById(`config-${element.id}`);
    if (configPanel) {
      configPanel.classList.remove('active');
    }
  }

  // Delete form element
  deleteElement(element: FormElement): void {
    this.formElements = this.formElements.filter(el => el.id !== element.id);
    
    if (this.formElements.length === 0) {
      const canvas = document.getElementById('formCanvas');
      if (canvas) {
        canvas.classList.add('empty');
      }
    }
  }

  // Clear all form elements
  clearForm(): void {
    this.formElements = [];
    this.elementCounter = 0;
    const canvas = document.getElementById('formCanvas');
    if (canvas) {
      canvas.classList.add('empty');
    }
  }

  // Generate code from current form
  generateCode(): void {
    let htmlform = '<form id="customForm" class="custom-form">\n';
    let htmlAngular = '<form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="custom-form">\n';
    let tsInterfaces = '';
    let tsFormControls = '';

    this.formElements.forEach((el) => {
      const fieldName = el.fieldName || 'field';
      const label = el.label || 'Field';
      const placeholder = el.placeholder || '';

      // form HTML
      htmlform += `  <div class="form-group">\n`;
      htmlform += `    <label for="${fieldName}">${label}</label>\n`;

      // Angular HTML
      htmlAngular += `  <div class="form-group">\n`;
      htmlAngular += `    <label for="${fieldName}">${label}</label>\n`;

      switch (el.type) {
        case 'text':
          htmlform += `    <input type="text" id="${fieldName}" name="${fieldName}" class="form-control" placeholder="${placeholder}">\n`;
          htmlAngular += `    <input type="text" id="${fieldName}" formControlName="${fieldName}" class="form-control" placeholder="${placeholder}">\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">This field is required</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string;\n`;
          tsFormControls += `    ${fieldName}: ['', Validators.required],\n`;
          break;

        case 'email':
          htmlform += `    <input type="email" id="${fieldName}" name="${fieldName}" class="form-control" placeholder="${placeholder}">\n`;
          htmlAngular += `    <input type="email" id="${fieldName}" formControlName="${fieldName}" class="form-control" placeholder="${placeholder}">\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">This field is required</small>\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['email']">Please enter a valid email</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string;\n`;
          tsFormControls += `    ${fieldName}: ['', [Validators.required, Validators.email]],\n`;
          break;

        case 'tel':
          htmlform += `    <input type="tel" id="${fieldName}" name="${fieldName}" class="form-control" placeholder="${placeholder}">\n`;
          htmlAngular += `    <input type="tel" id="${fieldName}" formControlName="${fieldName}" class="form-control" placeholder="${placeholder}">\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">This field is required</small>\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['pattern']">Please enter a valid phone number</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string;\n`;
          tsFormControls += `    ${fieldName}: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],\n`;
          break;

        case 'textarea':
          htmlform += `    <textarea id="${fieldName}" name="${fieldName}" class="form-control" placeholder="${placeholder}"></textarea>\n`;
          htmlAngular += `    <textarea id="${fieldName}" formControlName="${fieldName}" class="form-control" placeholder="${placeholder}"></textarea>\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">This field is required</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string;\n`;
          tsFormControls += `    ${fieldName}: ['', Validators.required],\n`;
          break;

        case 'select':
          htmlform += `    <select id="${fieldName}" name="${fieldName}" class="form-control">\n`;
          htmlform += `      <option value="">Select an option</option>\n`;
          htmlform += `      <option value="option1">Option 1</option>\n`;
          htmlform += `      <option value="option2">Option 2</option>\n`;
          htmlform += `      <option value="option3">Option 3</option>\n`;
          htmlform += `    </select>\n`;
          htmlAngular += `    <select id="${fieldName}" formControlName="${fieldName}" class="form-control">\n`;
          htmlAngular += `      <option value="">Select an option</option>\n`;
          htmlAngular += `      <option value="option1">Option 1</option>\n`;
          htmlAngular += `      <option value="option2">Option 2</option>\n`;
          htmlAngular += `      <option value="option3">Option 3</option>\n`;
          htmlAngular += `    </select>\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">This field is required</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string;\n`;
          tsFormControls += `    ${fieldName}: ['', Validators.required],\n`;
          break;

        case 'checkbox':
          htmlform += `    <div class="checkbox-group">\n`;
          htmlform += `      <label><input type="checkbox" name="${fieldName}[]" value="option1"> Option 1</label>\n`;
          htmlform += `      <label><input type="checkbox" name="${fieldName}[]" value="option2"> Option 2</label>\n`;
          htmlform += `    </div>\n`;
          htmlAngular += `    <div class="checkbox-group" formArrayName="${fieldName}">\n`;
          htmlAngular += `      <label><input type="checkbox" [value]="'option1'" (change)="onCheckboxChange($event, '${fieldName}')"> Option 1</label>\n`;
          htmlAngular += `      <label><input type="checkbox" [value]="'option2'" (change)="onCheckboxChange($event, '${fieldName}')"> Option 2</label>\n`;
          htmlAngular += `    </div>\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">Please select at least one option</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string[];\n`;
          tsFormControls += `    ${fieldName}: this.fb.array([], Validators.required),\n`;
          break;

        case 'radio':
          htmlform += `    <div class="radio-group">\n`;
          htmlform += `      <label><input type="radio" name="${fieldName}" value="option1"> Option 1</label>\n`;
          htmlform += `      <label><input type="radio" name="${fieldName}" value="option2"> Option 2</label>\n`;
          htmlform += `    </div>\n`;
          htmlAngular += `    <div class="radio-group">\n`;
          htmlAngular += `      <label><input type="radio" formControlName="${fieldName}" value="option1"> Option 1</label>\n`;
          htmlAngular += `      <label><input type="radio" formControlName="${fieldName}" value="option2"> Option 2</label>\n`;
          htmlAngular += `    </div>\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">Please select an option</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string;\n`;
          tsFormControls += `    ${fieldName}: ['', Validators.required],\n`;
          break;

        case 'date':
          htmlform += `    <input type="date" id="${fieldName}" name="${fieldName}" class="form-control">\n`;
          htmlAngular += `    <input type="date" id="${fieldName}" formControlName="${fieldName}" class="form-control">\n`;
          htmlAngular += `    <div class="error" *ngIf="formGroup.get('${fieldName}')?.invalid && formGroup.get('${fieldName}')?.touched">\n`;
          htmlAngular += `      <small *ngIf="formGroup.get('${fieldName}')?.errors?.['required']">This field is required</small>\n`;
          htmlAngular += `    </div>\n`;
          tsInterfaces += `  ${fieldName}: string;\n`;
          tsFormControls += `    ${fieldName}: ['', Validators.required],\n`;
          break;
      }

      htmlform += `  </div>\n\n`;
      htmlAngular += `  </div>\n\n`;
    });

    htmlform += `  <button type="submit" class="submit-btn">Submit</button>\n</form>`;
    htmlAngular += `  <button type="submit" class="submit-btn" [disabled]="formGroup.invalid">Submit</button>\n</form>`;

    const typescript = this.generateTypescriptCode(tsInterfaces, tsFormControls);
    const css = this.generateCSSCode();

    this.generatedCode = `<!-- ============================================ -->
<!-- FORM HTML (Standard Form) -->
<!-- ============================================ -->
${htmlform}

<!-- ============================================ -->
<!-- ANGULAR HTML (Reactive Forms) -->
<!-- ============================================ -->
<!-- nd-formbuilder.component.html -->
${htmlAngular}

<!-- ============================================ -->
<!-- CSS STYLES -->
<!-- ============================================ -->
<!-- nd-formbuilder.component.scss -->
${css}

<!-- ============================================ -->
<!-- TYPESCRIPT CODE -->
<!-- ============================================ -->
<!-- nd-formbuilder.component.ts -->
${typescript}`;

    this.showCodeModal = true;
  }

  // Generate TypeScript code
  private generateTypescriptCode(interfaces: string, controls: string): string {
    return `import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

interface GeneratedFormData {
${interfaces}}

@Component({
  selector: 'app-nd-formbuilder',
  templateUrl: './nd-formbuilder.component.html',
  styleUrls: ['./nd-formbuilder.component.scss']
})
export class NdFormbuilderComponent {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
${controls}    });
  }

  onCheckboxChange(event: any, fieldName: string): void {
    const formArray = this.formGroup.get(fieldName) as FormArray;
    if (event.target.checked) {
      formArray.push(this.fb.control(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      formArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData: GeneratedFormData = this.formGroup.value;
      console.log('Form Data:', formData);
      // Handle form submission
    } else {
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.formGroup.reset();
  }
}`;
  }

  // Generate CSS code
  private generateCSSCode(): string {
    return `.custom-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.form-control.ng-invalid.ng-touched {
  border-color: #e74c3c;
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-group label,
.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.error {
  margin-top: 5px;
}

.error small {
  color: #e74c3c;
  font-size: 12px;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`;
  }

  // Close code modal
  closeModal(): void {
    this.showCodeModal = false;
  }

  // Copy code to clipboard
  copyCode(): void {
    navigator.clipboard.writeText(this.generatedCode).then(() => {
      alert('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy code:', err);
    });
  }
}