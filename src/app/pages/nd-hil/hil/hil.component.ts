import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
interface CheckBoxOption {
  value: string;
  isSelected: string;
}

interface FormField {
  fieldname: string;
  Value: string | any[];
  sectionname?: string;
  AvgConfidenceScore?: number;
  ManualEdited?: string;
  IsCheckBox?: string;
  IsRadio?: string;
  CheckBoxOptions?: CheckBoxOption[];
  SuggestedValues?: string[];
  ErrorList?: string[];
  [key: string]: any;
}
@Component({
  selector: 'app-hil',
  templateUrl: './hil.component.html',
  styleUrls: ['./hil.component.scss']
})
export class HILComponent {
  @Input() jsonData: any;
  @Output() formDataChange = new EventEmitter<any>();

  formData: any = {};
  expandedSections: { [key: string]: boolean } = {};
  highlightedField: string | null = null;

 ngOnInit(): void {
    // Use provided jsonData or fallback to sample data
    this.jsonData = this.jsonData ;
    this.initializeExpandedSections();
  }

  initializeExpandedSections(): void {
    const form = this.jsonData.Forms[0];
    Object.keys(form).forEach(section => {
      this.expandedSections[section] = true;
    });
  }

  toggleSection(sectionKey: string | any): void {
    this.expandedSections[sectionKey] = !this.expandedSections[sectionKey];
  }

  handleFieldChange(path: string[], newValue: any): void {
    let current = this.formData;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = newValue;
    this.formDataChange.emit(this.formData);
  }

  getFieldValue(path: string[] | any): any {
    let current = this.formData;
    for (const key of path) {
      current = current?.[key];
    }
    return current || '';
  }

  getConfidenceColor(score: number | null | undefined | any): string {
    if (score === null || score === undefined || score === '') {
      return 'bg-purple-500';
    }
    if (score <= 40) return 'bg-red-500';
    if (score <= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  isCheckboxField(field: FormField | any): boolean {
    return (
      field.IsCheckBox === true ||
      field.IsCheckBox === 'true' ||
      field.IsCheckBox === 'Y'
    );
  }

  isRadioField(field: FormField | any): boolean {
    return (
      field.IsRadio === true ||
      field.IsRadio === 'true' ||
      field.IsRadio === 'Y'
    );
  }

  hasOptions(field: FormField | any): boolean {
    return (field.SuggestedValues?.length || field.CheckBoxOptions?.length) > 0;
  }

  onCheckboxChange(fieldPath: string[], option: CheckBoxOption, field: FormField | any): void {
    const updatedOptions = field.CheckBoxOptions.map((opt : any) => ({
      ...opt,
      isSelected: opt.value === option.value ? (opt.isSelected === 'Y' ? 'N' : 'Y') : opt.isSelected
    }));
    this.handleFieldChange(fieldPath, updatedOptions);
  }

  onRadioChange(fieldPath: string[], selectedOption: CheckBoxOption, field: FormField | any): void {
    const updatedOptions = field.CheckBoxOptions.map((opt : any) => ({
      ...opt,
      isSelected: opt.value === selectedOption.value ? 'Y' : 'N'
    }));
    this.handleFieldChange(fieldPath, updatedOptions);
  }

  onDropdownChange(fieldPath: string[], value: string): void {
    this.handleFieldChange(fieldPath, value);
  }

  onTextChange(fieldPath: string[], value: string): void {
    this.handleFieldChange(fieldPath, value);
  }

  onMouseEnter(fieldKey: string): void {
    this.highlightedField = fieldKey;
  }

  onMouseLeave(): void {
    this.highlightedField = null;
  }

  trackByKey(index: number, item: any): string {
    return item[0];
  }

  jsonStringify(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }














getForm : any;
 constructor(private http : HttpClient){
 this.http.get<any>('./assets/json/fromDetails.json').subscribe({
  next:(res: any)=>{
    console.log(res);
  },
  error:(_error: any)=>{
    console.log('_error',_error);
    
  },
 })
 }



 html=`
 <!-- hil-form.component.html -->
<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">HIL Form Editor</h1>
      <p class="text-gray-600 mt-2">Dynamic nested form with confidence scores and field validation</p>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <ng-container *ngFor="let form of jsonData.Forms; let i = index">
        <!-- Sections -->
        <ng-container *ngFor="let section of form | keyvalue; trackBy: trackByKey">
          <div class="mb-6 border-2 border-blue-400 rounded-lg overflow-hidden">
            <!-- Section Header -->
            <button
              (click)="toggleSection(section.key)"
              class="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white p-4 transition-colors"
            >
              <h3 class="text-lg font-bold">{{ section.key }}</h3>
              <i
                class="fas"
                [ngClass]="expandedSections[section.key] ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </button>

            <!-- Section Content -->
            <div *ngIf="expandedSections[section.key]" class="p-6 bg-gray-50 space-y-3">
              <!-- Groups/Fields in Section -->
              <ng-container *ngFor="let group of section.value | keyvalue; trackBy: trackByKey">
                <!-- Direct Field (has fieldname) -->
                <ng-container *ngIf="group.value?.fieldname">
                  <ng-container *ngTemplateOutlet="fieldTemplate; context: { $implicit: group.value, fieldKey: group.key, parentPath: [section.key] }"></ng-container>
                </ng-container>

                <!-- Group with Sub-fields -->
                <ng-container *ngIf="!group.value?.fieldname">
                  <div class="mb-4 border border-gray-300 rounded-lg overflow-hidden">
                    <!-- Group Header -->
                    <button
                      (click)="toggleSection(section.key + '.' + group.key)"
                      class="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-150 p-3 transition-colors"
                    >
                      <h4 class="font-semibold text-gray-800">{{ group.key }}</h4>
                      <i
                        class="fas"
                        [ngClass]="expandedSections[section.key + '.' + group.key] ? 'fa-chevron-up' : 'fa-chevron-down'"
                      ></i>
                    </button>

                    <!-- Group Content -->
                    <div *ngIf="expandedSections[section.key + '.' + group.key]" class="p-4 bg-gray-50 space-y-3">
                      <ng-container *ngFor="let field of group.value | keyvalue; trackBy: trackByKey">
                        <ng-container *ngTemplateOutlet="fieldTemplate; context: { $implicit: field.value, fieldKey: field.key, parentPath: [section.key, group.key] }"></ng-container>
                      </ng-container>
                    </div>
                  </div>
                </ng-container>
              </ng-container>
            </div>
          </div>
        </ng-container>
      </ng-container>
    </div>

    <!-- Form Data Display -->
    <div *ngIf="formData | keyvalue | slice:0:1; else noData" class="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Form Data (Real-time)</h2>
      <div class="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm font-mono">
        {{ jsonStringify(formData) }}
      </div>
    </div>
    <ng-template #noData>
      <div class="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p class="text-blue-700">Edit form fields to see real-time data updates here</p>
      </div>
    </ng-template>
  </div>
</div>

<!-- Field Template -->
<ng-template #fieldTemplate let-field let-fieldKey="fieldKey" let-parentPath="parentPath">
  <div class="mb-4 p-3 bg-white rounded border border-gray-200">
    <!-- Single Checkbox -->
    <ng-container *ngIf="isCheckboxField(field) && !isRadioField(field) && !hasOptions(field)">
      <label class="flex items-center cursor-pointer">
        <input
          type="checkbox"
          [checked]="getFieldValue([...parentPath, fieldKey]) === 'Y'"
          (change)="handleFieldChange([...parentPath, fieldKey], $any($event.target).checked ? 'Y' : 'N')"
          class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span class="ml-3 font-medium text-gray-700">{{ field.fieldname }}</span>
        <!-- Confidence Badge -->
        <div
          class="w-3 h-3 rounded-full ml-2"
          [ngClass]="field.ManualEdited === 'Y' ? 'bg-blue-500' : getConfidenceColor(field.AvgConfidenceScore)"
          [title]="field.ManualEdited === 'Y' ? 'Manually Edited' : 'Confidence: ' + field.AvgConfidenceScore + '%'"
        ></div>
      </label>
    </ng-container>

    <!-- Multiple Checkboxes -->
    <ng-container *ngIf="isCheckboxField(field) && hasOptions(field)">
      <div class="flex items-center mb-3">
        <div
          class="w-3 h-3 rounded-full mr-2"
          [ngClass]="field.ManualEdited === 'Y' ? 'bg-blue-500' : getConfidenceColor(field.AvgConfidenceScore)"
          [title]="field.ManualEdited === 'Y' ? 'Manually Edited' : 'Confidence: ' + field.AvgConfidenceScore + '%'"
        ></div>
        <label class="font-medium text-gray-700">{{ field.fieldname }}</label>
      </div>
      <div class="space-y-2 ml-5">
        <label *ngFor="let option of field.CheckBoxOptions" class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            [checked]="option.isSelected === 'Y'"
            (change)="onCheckboxChange([...parentPath, fieldKey], option, field)"
            class="w-4 h-4 text-blue-600 rounded"
          />
          <span class="ml-2 text-gray-700">{{ option.value }}</span>
        </label>
      </div>
    </ng-container>

    <!-- Radio Buttons -->
    <ng-container *ngIf="isRadioField(field) && hasOptions(field)">
      <div class="flex items-center mb-3">
        <div
          class="w-3 h-3 rounded-full mr-2"
          [ngClass]="field.ManualEdited === 'Y' ? 'bg-blue-500' : getConfidenceColor(field.AvgConfidenceScore)"
          [title]="field.ManualEdited === 'Y' ? 'Manually Edited' : 'Confidence: ' + field.AvgConfidenceScore + '%'"
        ></div>
        <label class="font-medium text-gray-700">{{ field.fieldname }}</label>
      </div>
      <div class="space-y-2 ml-5">
        <label *ngFor="let option of field.CheckBoxOptions" class="flex items-center cursor-pointer">
          <input
            type="radio"
            [name]="fieldKey"
            [checked]="option.isSelected === 'Y'"
            (change)="onRadioChange([...parentPath, fieldKey], option, field)"
            class="w-4 h-4 text-blue-600"
          />
          <span class="ml-2 text-gray-700">{{ option.value }}</span>
        </label>
      </div>
    </ng-container>

    <!-- Dropdown -->
    <ng-container *ngIf="hasOptions(field) && !isCheckboxField(field) && !isRadioField(field)">
      <div class="flex items-center mb-2">
        <div
          class="w-3 h-3 rounded-full mr-2"
          [ngClass]="field.ManualEdited === 'Y' ? 'bg-blue-500' : getConfidenceColor(field.AvgConfidenceScore)"
          [title]="field.ManualEdited === 'Y' ? 'Manually Edited' : 'Confidence: ' + field.AvgConfidenceScore + '%'"
        ></div>
        <label class="font-medium text-gray-700">{{ field.fieldname }}</label>
      </div>
      <select
        [value]="getFieldValue([...parentPath, fieldKey])"
        (change)="onDropdownChange([...parentPath, fieldKey], $any($event.target).value)"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">Select {{ field.fieldname }}</option>
        <option *ngFor="let option of field.SuggestedValues" [value]="option">
          {{ option }}
        </option>
      </select>
    </ng-container>

    <!-- Text Input/Textarea -->
    <ng-container *ngIf="!hasOptions(field) && !isCheckboxField(field) && !isRadioField(field)">
      <div class="flex items-center mb-2">
        <div
          class="w-3 h-3 rounded-full mr-2"
          [ngClass]="field.ManualEdited === 'Y' ? 'bg-blue-500' : getConfidenceColor(field.AvgConfidenceScore)"
          [title]="field.ManualEdited === 'Y' ? 'Manually Edited' : 'Confidence: ' + field.AvgConfidenceScore + '%'"
        ></div>
        <label class="font-medium text-gray-700">{{ field.fieldname }}</label>
      </div>

      <textarea
        *ngIf="getFieldValue([...parentPath, fieldKey])?.length > 50"
        [value]="getFieldValue([...parentPath, fieldKey])"
        (change)="onTextChange([...parentPath, fieldKey], $any($event.target).value)"
        (mouseenter)="onMouseEnter(fieldKey)"
        (mouseleave)="onMouseLeave()"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        rows="3"
        [placeholder]="'Enter ' + field.fieldname"
      ></textarea>

      <input
        *ngIf="!getFieldValue([...parentPath, fieldKey]) || getFieldValue([...parentPath, fieldKey])?.length <= 50"
        type="text"
        [value]="getFieldValue([...parentPath, fieldKey])"
        (change)="onTextChange([...parentPath, fieldKey], $any($event.target).value)"
        (mouseenter)="onMouseEnter(fieldKey)"
        (mouseleave)="onMouseLeave()"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        [placeholder]="'Enter ' + field.fieldname"
      />

      <!-- Error Messages -->
      <div *ngIf="field.ErrorList && field.ErrorList.length > 0" class="mt-2 text-red-600 text-xs flex items-start gap-1">
        <i class="fas fa-exclamation-triangle mt-0.5"></i>
        <ul class="list-disc list-inside">
          <li *ngFor="let error of field.ErrorList">{{ error }}</li>
        </ul>
      </div>
    </ng-container>
  </div>
</ng-template>`
}
