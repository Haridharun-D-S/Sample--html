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

  // ✅ Typed arrays (fixes "never" issue)
  dropdownData: { id: number; name: string }[] = [];
  filteredData: { id: number; name: string }[] = [];

  searchControl = new FormControl('');

  // ✅ Typed FormControl to avoid "never"
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
