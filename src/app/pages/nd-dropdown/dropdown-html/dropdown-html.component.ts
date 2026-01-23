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

    /** ✅ Returns selected values (works for MULTI, MULTI-SEARCH, NESTED dropdowns) */
    get selectedNames(): string {
      let allItems: any[] = [];

      // Include parent level values (single & autocomplete)
      allItems = [...allItems, ...this.dropdownData];

      // Include nested child values
      this.lookupResponse.LookupData.forEach(parent => {
        if (parent.children) {
          allItems = [...allItems, ...parent.children];
        }
      });

      return allItems
        .filter(x => this.selectedValues.includes(x.id))
        .map(x => x.name)
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
