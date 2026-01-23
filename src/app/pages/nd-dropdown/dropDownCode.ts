export const htmlDropdownCode = `<!--------------------------- Material Dropdown Starts -------------------------------->
<!-- SINGLE SELECT DROPDOWN -->
<mat-form-field appearance="outline" *ngIf="dropdownType === 'single'" class="full-width">
  <mat-label>{{ label }}</mat-label>
  <mat-select>
    <mat-option *ngFor="let item of dropdownData" [value]="item.id">
      {{ item.name }}
    </mat-option>
  </mat-select>
</mat-form-field>


<!-- MULTIPLE SELECT DROPDOWN -->
<mat-form-field appearance="outline" *ngIf="dropdownType === 'multi'" class="full-width">
  <mat-label>{{ label }}</mat-label>
  <mat-select multiple>
    <mat-option *ngFor="let item of dropdownData" [value]="item.id">
      {{ item.name }}
    </mat-option>
  </mat-select>
</mat-form-field>


<!-- AUTOCOMPLETE DROPDOWN -->
<mat-form-field appearance="outline" *ngIf="dropdownType === 'autocomplete'" class="full-width">
  <mat-label>{{ label }}</mat-label>
  <input type="text" matInput [formControl]="searchControl" [matAutocomplete]="auto">

  <mat-autocomplete #auto="matAutocomplete">
    <mat-option *ngFor="let item of dropdownData | filter: (searchControl.value ?? '')" [value]="item.name">
      {{ item.name }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>

<!--------------------------- Material Dropdown Ends -------------------------------->


<!--------------------------- Html Dropdown Starts -------------------------------->

<!-- ================== TYPE : SINGLE ================== -->
<select *ngIf="dropdownType === 'single'">
  <option disabled selected>Select value</option>
  <option *ngFor="let item of dropdownData" [value]="item.id">
    {{ item.name }}
  </option>
</select>


<!-- ================== TYPE : MULTI ================== -->
<div class="multi-container" *ngIf="dropdownType === 'multi'">
  <input type="text"
         class="dropdown-input"
         placeholder="{{ label }}"
         readonly
         (click)="showDropdown = !showDropdown"
         [value]="selectedNames" />

  <div class="dropdown-panel" *ngIf="showDropdown">
    <label *ngFor="let item of dropdownData" class="checkbox-item">
      <input type="checkbox"
             [checked]="selectedValues.includes(item.id)"
             (change)="updateCheckbox($event, item.id)" />
      {{ item.name }}
    </label>
  </div>
</div>


<!-- ================== TYPE : AUTOCOMPLETE ================== -->
<div *ngIf="dropdownType === 'autocomplete'" class="dropdown-container" #dropdownRef>

  <input type="text"
         placeholder="Search..."
         [(ngModel)]="searchText"
         [value]="selectedNamesAutocomplete"
         (focus)="showDropdown = true"
         class="search-input" />

  <div class="dropdown-panel" *ngIf="showDropdown">
    <select size="6" class="serach-option" (change)="selectAutocomplete($event)">
      <option class="search-option"
              *ngFor="let item of dropdownData | filter: searchText"
              [value]="item.id">
        {{ item.name }}
      </option>
    </select>
  </div>

</div>


<!-- ============= TYPE : MULTI-SEARCH ================= -->
<div *ngIf="dropdownType === 'multi-search'" class="dropdown-container" #dropdownRef>

  <input type="text"
         class="dropdown-input"
         placeholder="Search values..."
         [value]="selectedNames"
         (focus)="showDropdown = true"
         readonly />

  <div class="dropdown-panel" *ngIf="showDropdown">

    <input type="text"
           class="dropdown-search"
           placeholder="Search values..."
           [(ngModel)]="searchText" />

    <div class="multi-item" *ngFor="let item of dropdownData | filter:searchText">
      <input type="checkbox"
             [checked]="selectedValues.includes(item.id)"
             (change)="updateCheckbox($event, item.id)" />
      <label>{{ item.name }}</label>
    </div>

  </div>

</div>


<!-- ================== TYPE : NESTED (Parent → Child) ================== -->
<div *ngIf="dropdownType === 'nested'" class="dropdown-wrapper" #dropdownRef>

  <!-- Input -->
  <div class="dropdown-input" (click)="showDropdown = !showDropdown">
    <span>{{ selectedNames || 'Select Nested Option' }}</span>
    <span class="dropdown-arrow" [ngClass]="{ rotate: showDropdown }">▼</span>
  </div>

  <!-- Dropdown Panel -->
  <div class="dropdown-panel" *ngIf="showDropdown">

    <div class="nested-parent"
         *ngFor="let parent of lookupResponse.LookupData"
         (click)="toggleParent(parent.id)">

      <div class="nested-parent-title">
        {{ parent.name }}
        <span class="dropdown-arrow" [ngClass]="{ rotate: expandedParent === parent.id }">›</span>
      </div>

      <!-- Child section -->
      <div *ngIf="expandedParent === parent.id" class="nested-child-area">

        <label *ngFor="let child of parent.children"
               class="multi-item"
               (click)="$event.stopPropagation()"> <!-- ✅ prevents dropdown close -->

          <input type="checkbox"
                [checked]="selectedValues.includes(child.id)"
                (change)="updateCheckbox($event, child.id); $event.stopPropagation()" /> <!-- ✅ -->

          {{ child.name }}
        </label>

      </div>
    </div>

  </div>

</div>

<!--------------------------- Html Dropdown Ends -------------------------------->
`;
export const tsDropdownCode = `<!--------------------------- Material Dropdown Starts -------------------------------->
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() label: string = 'Select Value';
  @Input() dropdownType: 'single' | 'multi' | 'autocomplete' | 'multi-search' = 'single';

  lookupResponse = {
    "LookupData": [
      { "id": 3, "name": "10010AZ" },
      { "id": 4, "name": "270" },
      { "id": 5, "name": "271" },
      { "id": 6, "name": "275" },
      { "id": 7, "name": "276" },
      { "id": 8, "name": "277" },
      { "id": 9, "name": "277CA" },
      { "id": 10, "name": "277U" },
      { "id": 11, "name": "278" },
      { "id": 12, "name": "834" },
      { "id": 13, "name": "837D" },
      { "id": 14, "name": "837P" },
      { "id": 15, "name": "999" },
      { "id": 16, "name": "ERAEW10202" },
      { "id": 17, "name": "NCPDP" },
      { "id": 18, "name": "TA1" }
    ]
  };

  // Typed arrays (fixes "never" issue)
  dropdownData: { id: number; name: string }[] = [];
  filteredData: { id: number; name: string }[] = [];

  searchControl = new FormControl('');

  // Typed FormControl to avoid "never"
  selectedValues = new FormControl<{ id: number; name: string }[]>([]);

  ngOnInit() {
    this.dropdownData = this.lookupResponse.LookupData;
    this.filteredData = [...this.dropdownData];

    // search handling
    this.searchControl.valueChanges.subscribe(value => {
      const keyword = value?.toLowerCase() || '';
      this.filteredData = this.dropdownData.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
    });
  }

  toggleSelection(item: { id: number; name: string }) {
    const current = this.selectedValues.value || [];
    const index = current.findIndex(x => x.id === item.id);

    if (index === -1) current.push(item);
    else current.splice(index, 1);

    this.selectedValues.setValue([...current]);
  }

  isChecked(item: { id: number; name: string }) {
    return (this.selectedValues.value || []).some(x => x.id === item.id);
  }
}
<!--------------------------- Material Dropdown Ends -------------------------------->


<!--------------------------- Html Dropdown Starts -------------------------------->
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown-html',
  templateUrl: './dropdown-html.component.html',
  styleUrls: ['./dropdown-html.component.scss']
})
export class DropdownHtmlComponent implements OnInit {

  @Input() label: string = 'Select Value';
  @Input() dropdownType: 'single' | 'multi' | 'autocomplete' | 'multi-search' | 'nested' = 'single';

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  lookupResponse = {
    "LookupData": [
      {
        "id": 1,
        "name": "Healthcare Transactions",
        "children": [
          { "id": 101, "name": "837P" },
          { "id": 102, "name": "837D" },
          { "id": 103, "name": "835" }
        ]
      },
      {
        "id": 2,
        "name": "Pharmacy",
        "children": [
          { "id": 201, "name": "NCPDP" },
          { "id": 202, "name": "275" }
        ]
      },
      {
        "id": 3,
        "name": "Eligibility",
        "children": [
          { "id": 301, "name": "270" },
          { "id": 302, "name": "271" }
        ]
      }
    ]
  };

  dropdownData:any = [];
  searchText = '';
  selectedValues: number[] = [];
  showDropdown = false;
  selectedAutocompleteId: number | null = null;
  expandedParent: number | null = null;

  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    this.dropdownData = this.lookupResponse.LookupData;
  }

  updateCheckbox(event: any, id: number) {
    if (event.target.checked) {
      this.selectedValues.push(id);
    } else {
      this.selectedValues = this.selectedValues.filter(x => x !== id);
    }
  }

/** ✅ Display the selected autocomplete name in the input */
get selectedNamesAutocomplete(): string {
  const selected = this.dropdownData.find((x: { id: number | null; }) => x.id === this.selectedAutocompleteId);
  return selected ? selected.name : '';
}


  /** ✅ Return selected child names (nested dropdown) */
  get selectedNames(): string {
    return this.lookupResponse.LookupData
      .flatMap(parent => parent.children)
      .filter(child => this.selectedValues.includes(child.id))
      .map(child => child.name)
      .join(', ');
  }

  selectAutocomplete(event: any) {
    this.selectedAutocompleteId = Number(event.target.value);
    this.showDropdown = false;
  }

  toggleParent(id: number) {
    this.expandedParent = this.expandedParent === id ? null : id;
  }

  /** ✅ Close dropdown on outside click */
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}

<!--------------------------- Html Dropdown Ends -------------------------------->
`;
export const cssDropdownCode = `<!--------------------------- Material Dropdown Starts -------------------------------->
.full-width {
  width: 100%;
}

.search-field {
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox {
  scale: 1.2;
}

.label {
  font-size: 14px;
}

<!--------------------------- Material Dropdown Ends -------------------------------->


<!--------------------------- Html Dropdown Starts -------------------------------->
   .dropdown-input,
.search-input,
select {
  width: 100% !important;
  padding: 10px 12px;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  position: relative;
}

.dropdown-panel {
  position: absolute;
  background: #fff;
  border: 1px solid #dadada;
  border-radius: 4px;
  max-height: 220px;
  overflow-y: auto;
  margin-top: 4px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.18);
  z-index: 1000;
  width: 25% !important;
}


.dropdown-search {
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid #e5e5e5;
  outline: none;
  min-width: 100%;
}

.dropdown-search:focus {
  border-color: #3f51b5;
}

.multi-item,
.checkbox-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.multi-item:hover,
.checkbox-item:hover {
  background: rgba(63, 81, 181, 0.08);
}

.multi-item input[type="checkbox"],
.checkbox-item input[type="checkbox"] {
  transform: scale(1.1);
  accent-color: #3f51b5;
  margin-right: 5px;
}

.serach-option{
  overflow: hidden;
}

.search-option{
  padding: 10px 0px;
}

.nested-parent {
  padding: 8px 10px;
  cursor: pointer;
}

.nested-parent-title {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.dropdown-arrow{
  position: absolute;
  right: 12px;
  color: #757575;
  font-size: 12px;
}

.nested-parent-title .dropdown-arrow.rotate {
  transform: rotate(90deg);
}

.nested-child-area {
  padding-left: 10px;
  border-left: 2px solid #e0e0e0;
  margin-top: 6px;
}
<!--------------------------- Html Dropdown Ends -------------------------------->
`;
