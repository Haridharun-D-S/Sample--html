import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { PopupCustomComponent } from '../../shared-module/popup-custom/popup-custom.component';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-case-list-page',
  templateUrl: './case-list-page.component.html',
  styleUrls: ['./case-list-page.component.scss']
})
export class CaseListPageComponent {
  filterValues;
  globalSerach;
  submittedFilters;
  filterFields = [];

  availableFields: any[] = [];

  Lookups = []


  //Filter Component
  filterForm: FormGroup;

  constructor(private formBuilder: FormBuilder,public dialog: MatDialog,private sessionStorage: SessionStorageService,private sharedService: SharedServiceService) {
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({});

   
  }



  addFilter() {

    const dialogRef = this.dialog.open(PopupCustomComponent, {
      data: {
        type : 'Add Filter',
        title: 'Add Filter',
        titlePosition: 'left',
        // contentPosition: 'left',
        buttonPosition: 'right',
        additionalButtons: [],
        acceptButtonTitle: 'Ok',
        declineButtonTitle: 'Cancel',
        availableFields : this.availableFields,
        filterForm : this.filterForm,
        showAcceptButton : true,
        showDeclineButton : true
      },
      height: 'auto',
      width: '500px'
  });
  dialogRef.disableClose = true;

  dialogRef.afterClosed().subscribe(result => {
      if(result) {
          // console.log(result);
          result.forEach(field => {
            if (!field.Added) {
              const index = this.filterFields.findIndex(f => f.ColumnName === field.ColumnName);
              if (index !== -1) {
                this.filterFields.splice(index, 1);
                this.filterForm.removeControl(field.ColumnName);
              }
            }
            if (field.Added && !this.filterFields.some(f => f.ColumnName === field.ColumnName)) {
              this.filterFields.push({
                FieldType: field.FieldType,
                ColumnName: field.ColumnName,
                DefaultFilter: field.DefaultFilter,
                Lookups: field.Lookups,
                Added: field.Added
              });
              field.Added = true;
              this.filterForm.addControl(field.ColumnName, new FormControl(''));
            }
            // console.log(this.filterFields);
          });
      }
  });

    
  }

  /**
   * Filter Submit
   */

  onSubmit() {
    
      const filterss: Filter[] = Object.keys(this.filterForm.value).map(columnName => ({
        columnName,
        filterValues: [this.filterForm.value[columnName]]
      }));
      
      this.transformFilterValues(filterss);
      // console.log(filterss);
      this.submittedFilters = {
        globalSearchFilter : this.globalSerach,
        filters : filterss
      }
    
  }

  /**
   * 
   * @param filters 
   */

  transformFilterValues(filters) {
    // console.log(filters);
    filters.forEach(filter => {
      if(filter.columnName === 'Created Date' || filter.columnName === 'Completed Date') {
        if (filter.filterValues.length > 0 && !isNaN(Date.parse(filter.filterValues[0]))) {
          filter.filterValues = filter.filterValues.map(value => this.transformDateToMMDDYYYY(value));
       }
      } else {
        return filter.filterValues;
      }
        
    });
}

/**
 * 
 * @param dateString 
 */

transformDateToMMDDYYYY(dateString) {
  const date = new Date(dateString);
  const mm = String(date.getMonth() + 1).padStart(2, '0'); 
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

  /**
   * Global Serach
   */

  globalSearch() {
    // console.log(this.globalSerach);
    this.filterForm.reset();
    this.submittedFilters = {
      globalSearchFilter : this.globalSerach,
      filters : []
    }
    // console.log(this.submittedFilters);
    
  }

  /**
   * 
   * @param filtervalue 
   *  Clear Filter
   */

  clearFilter(filtervalue) {
    this.filterForm.reset();
    this.globalSerach = null; 
  }

  /**
   * 
   * @param data 
   * Filter Fields Render Data
   */

  gridFilter(data) {
    this.filterValues = data;
    this.filterFields = [];
    const observables = [];
    this.availableFields = [];
    this.filterValues.forEach(element => {
        if(element.defaultFilterFlag === 'Y') {
          if((element.dataType === "nvarchar" || element.dataType === "varchar" ) && (element?.lookupCode === undefined || element?.lookupCode === "" )) {
            this.filterFields.push({
              FieldType: 'Input',
              ColumnName: element.columnName,
              DefaultFilter: true,
              Added: false
            })
          } else if(element.dataType === "Date") {
            this.filterFields.push({
                FieldType: 'datepicker',
                ColumnName: element.columnName,
                DefaultFilter: true,
                Added: false
            })
          } else if((element.dataType === "nvarchar" || element.dataType === "varchar")  && (element?.lookupCode != undefined || element?.lookupCode != "")) {
            
              observables.push(
                this.sharedService.getLookupsForFilter({ lookupCode: element.lookupCode })
                  .pipe(
                    )
              );

            forkJoin(observables).subscribe(results => {
              const filteredValues = this.filterValues.filter(value => value.defaultFilterFlag === 'Y' && value.lookupCode);

              filteredValues.forEach((element, index) => {
                const resp = results[index];
                if (resp) {
                  const existingFieldIndex = this.filterFields.findIndex(field => field.ColumnName === element.columnName);
                  if (existingFieldIndex === -1) {
                    this.filterFields.push({
                      FieldType: 'dropdown',
                      ColumnName: element.columnName,
                      DefaultFilter: true,
                      Lookups: resp,
                      Added: false
                    });
                  } else {
                    if (!this.filterFields[existingFieldIndex].Lookups.length) {
                      this.filterFields[existingFieldIndex].Lookups = resp;
                    }
                  }
                } else {
                  const existingFieldIndex = this.filterFields.findIndex(field => field.ColumnName === element.columnName);
                  if (existingFieldIndex === -1) {
                    this.filterFields.push({
                      FieldType: 'dropdown',
                      ColumnName: element.columnName,
                      DefaultFilter: true,
                      Lookups: [],
                      Added: false
                    });
                  }
                }
              });

              this.addFormControls();
            });
              
          }
        }  
        if(element.filterFlag === 'Y') {
          if((element.dataType === "nvarchar" || element.dataType === "varchar" ) && (element?.lookupCode === undefined || element?.lookupCode === "" )) {
            this.availableFields.push({
              FieldType: 'Input',
              ColumnName: element.columnName,
              DefaultFilter: false,
              Added: element.defaultFilterFlag === 'N' ? false : true,
              DefaultDisable: element.defaultFilterFlag
            })
          } else if(element.dataType === "Date") {
            this.availableFields.push({
                FieldType: 'datepicker',
                ColumnName: element.columnName,
                DefaultFilter: false,
                Added: element.defaultFilterFlag === 'N' ? false : true,
                DefaultDisable: element.defaultFilterFlag
            })
          } else if((element.dataType === "nvarchar" || element.dataType === "varchar")  && (element?.lookupCode != undefined || element?.lookupCode != "")) {
            let reqObj = {
              lookupCode : element?.lookupCode
            }

            this.sharedService.getLookupsForFilter(reqObj).subscribe(resp => {
                  if(resp) {
                    this.availableFields.push({
                      FieldType: 'dropdown',
                      ColumnName: element.columnName,
                      DefaultFilter: false,
                      Lookups: resp,
                      Added: element.defaultFilterFlag === 'N' ? false : true,
                      DefaultDisable: element.defaultFilterFlag
                  })
                  } else {
                    this.availableFields.push({
                      FieldType: 'dropdown',
                      ColumnName: element.columnName,
                      DefaultFilter: false,
                      Lookups: [],
                      Added: element.defaultFilterFlag === 'N' ? false : true,
                      DefaultDisable: element.defaultFilterFlag
                  })
                  }
            });
          }
        }
    });
     console.log(this.filterFields);
     this.filterFields.forEach(field => {
          this.filterForm.addControl(field.ColumnName, new FormControl(''));
    });
  }

  addFormControls() {
    this.filterForm = this.formBuilder.group({});
    this.filterFields.forEach(field => {
      this.filterForm.addControl(field.ColumnName, new FormControl(''));
    });
  }

 
}

export interface Filter {
  columnName: string;
  filterValues: string[];
}
