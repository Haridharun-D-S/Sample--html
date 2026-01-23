import { Component, EventEmitter, Inject,  Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { FormGroup,FormBuilder, Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { DateConvertPipe } from 'src/app/shared/pipe/date-convert-pipe';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';

const moment1 = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM/DD/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
MY_FORMATS.display.dateInput = 'MM/DD/YYYY';
export interface IDynamicDialogConfig {
  title?: string;
  titleFontSize ?: string;
  showClose?: boolean;
  acceptButtonTitle?: string;
  declineButtonTitle?: string;
  dialogContentFontSize ?: string;
  dialogContent?: string;
  acceptButtonColor ?:string;
  deleteButtonColor ?:string;
  additionalButtons?: {
    label: string;
    action: string;
    color?: string;
  }[];
  titlePosition?: 'right' | 'left' | 'center'; 
  contentPosition?: 'right' | 'left' | 'center' | 'None'; 
  buttonPosition?: 'right' | 'left' | 'center';
  selectorName?: string;
  selectorInput?: [];
  fileDetails?: string;
  showAcceptButton?: boolean;
  showDeclineButton?: boolean;
  allocationDetails?;
  teamMemberDetails?;
  DelegateAdmin?;
  gridWidget?: EcareGridSettings;
  btnList?;
}

@Component({
  selector: 'app-popup-custom',
  templateUrl: './popup-custom.component.html',
  styleUrls: ['./popup-custom.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PopupCustomComponent {
  @Output() buttonClicked = new EventEmitter<string>();
  @Output() customButtonClicked = new EventEmitter<any>();
  dataEntryPageInput: string = 'popup';
  Data;
  loading = false;
  disableSettingsAcceptBtn: boolean = false;

  //AssignReassign lookups
  caseOwnerList = [];
  caseSupervisorList = [];
  ownerAssignee = [];
  ownerAssigneeTask = [];
  setPriorityList = [];
  selectOwner;
  selectSupervisor;

  //UpdateSLA 
  updateSLAForm: FormGroup;
  minDateSLA: Date;
  maxDateSLA: Date;
  gridWidget: EcareGridSettings;
  availableFields;
  WorkqueueButtonList: any;
  isLoading: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<PopupCustomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDynamicDialogConfig,
    public service : SharedServiceService,
    private formbuilder: FormBuilder,
    private datePipe: DatePipe,
    private loaderService: CommonLoaderService
  ) {
    //console.log(this.data);
    if(this.data) {
      this.ownerAssignee = [];
      this.ownerAssigneeTask = [];
      this.setPriorityList = [];
      this.updateSLABuildForm();
      this.maxDateSLA = new Date()
      this.minDateSLA = new Date();
      this.Data = this.data;
      this.loading = true;
      if(this.Data.type === 'Assign/Reassign') {
        // this.assignReassign()
        this.loadAssignReassignGridData();
      } else if(this.Data.type === 'Assign/Reassign Task') {
        this.loadAssignReassignTaskGridData()
      }  else if(this.Data.type === 'Set Priority') {
        this.loadSetPriorityGridData();
      } else if(this.Data.type === 'Add Filter') {
        this.availableFields = this.Data.availableFields;
      } else if(this.Data.type === 'insightsGrid') {
        this.isLoading = true;
        this.loadInsightsGrid();
      }

    }
    
  }

  loadAssignReassignTaskGridData() {
    this.gridWidget = {
      id: 'AssignReAssignTask',
      checklocaljson : true,
      rowSelection: 'single',
      gridname: 'AssignReAssignTaskGrid',
      gridDropdownData: this.Data.ownerDetails,
      localjson : this.getAssignReassignTaskStaticData()
    };
  }

  loadAssignReassignGridData() {
    this.gridWidget = {
      id: 'AssignReAssign',
      checklocaljson : true,
      rowSelection: 'single',
      gridname: 'AssignReAssignGrid',
      gridDropdownData: this.Data.ownerDetails,
      localjson : this.getAssignReassignStaticData()
    };
  }

  getAssignReassignTaskStaticData(){
    let data = {
      "columnProperties":  [
        {
            "columnName": "Task ID",
            "field": "Task ID",
            "dataType": "varchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "Y",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Task_ID",
            "field": "Task_ID",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Case_ID",
            "field": "Case_ID",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Doc ID",
            "field": "Doc ID",
            "dataType": "varchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "Y",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Task Name",
            "field": "Task Name",
            "dataType": "varchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "Y",
            "filterFlag": "Y",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Pages",
            "field": "Pages",
            "dataType": "int",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "Y",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Status",
            "field": "Status",
            "dataType": "varchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "Y",
            "filterFlag": "Y",
            "lookupCode": "Task Status",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Current Owner",
            "field": "Task Owner",
            "dataType": "varchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "Y",
            "filterFlag": "Y",
            "lookupCode": "Task Owner",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
          "columnName": "New Owner",
          "field": "Owner",
          "dataType": "nvarchar",
          "visibilityFlag": "Y",
          "editable": "N",
          "action": "N",
          "statusIcon": "N",
          "dynamicStatusIcon": null,
          "hyperlink": "N",
          "checkboxSelection": "N",
          "selectDropdown": "Y"
      },
        {
            "columnName": "Assigned Date",
            "field": "Assigned Date",
            "dataType": "Date",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "Y",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Completed Date",
            "field": "Completed Date",
            "dataType": "Date",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "Y",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "File Location",
            "field": "File Location",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Case Task Owner Id",
            "field": "Case Task Owner Id",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Case Task Manager Id",
            "field": "Case Task Manager Id",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Case Task Supervisor Id",
            "field": "Case Task Supervisor Id",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Case Task Assignee Id",
            "field": "Case Task Assignee Id",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Process Flag",
            "field": "Process Flag",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        },
        {
            "columnName": "Assign/Reassign Flag",
            "field": "Assign/Reassign Flag",
            "dataType": "varchar",
            "visibilityFlag": "N",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "defaultFilterFlag": "N",
            "filterFlag": "N",
            "lookupCode": "",
            "columnWidthType": null,
            "columnWidthValue": null
        }
    ],
      "GridData": []
    }
    if(this.Data.caseDetail && this.Data.caseDetail.length > 0){
      this.Data.caseDetail.map(item => {
        item.hyperlinkIcon = '';
      });
    }
    data.GridData = this.Data.caseDetail
   return data;
   }
  getAssignReassignStaticData(){
    let data = {
      "columnProperties": [
          {
              "columnName": "Doc ID",
              "field": "Doc ID",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Case_ID",
              "field": "Case_ID",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Doc Name",
              "field": "Doc Name",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Case ID",
              "field": "Case ID",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Pages",
              "field": "Pages",
              "dataType": "int",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Created Date",
              "field": "Created Date",
              "dataType": "Date",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Priority",
              "field": "Priority",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Completed Date",
              "field": "Completed Date",
              "dataType": "Date",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Status",
              "field": "Status",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Current Owner",
              "field": "Owner",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
            "columnName": "New Owner",
            "field": "Owner",
            "dataType": "nvarchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "selectDropdown": "Y"
        },
          {
              "columnName": "Business Status",
              "field": "Business Status",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Current Task",
              "field": "Current Task",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "File Location",
              "field": "File Location",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Owner Id",
              "field": "Case Owner Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Manager Id",
              "field": "Case Manager Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Supervisor Id",
              "field": "Case Supervisor Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Assignee Id",
              "field": "Case Assignee Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Row Colour",
              "field": "Row Colour",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Process Flag",
              "field": "Process Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Delete Doc Flag",
              "field": "Delete Doc Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Set Priority Flag",
              "field": "Set Priority Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Assign/Reassign Flag",
              "field": "Assign/Reassign Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Update Status Flag",
              "field": "Update Status Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          }
      ],
      "GridData": []
    }
    if(this.Data.caseDetail && this.Data.caseDetail.length > 0){
      this.Data.caseDetail.map(item => {
        item.hyperlinkIcon = '';
      });
    }
    data.GridData = this.Data.caseDetail
   return data;
   }

   loadSetPriorityGridData() {
    this.gridWidget = {
      id: 'SetPriority',
      checklocaljson : true,
      rowSelection: 'single',
      gridname: 'SetPriorityGrid',
      gridDropdownData: this.Data.ownerDetails,
      localjson : this.getSetPriorityStaticData()
    };
  }

  getSetPriorityStaticData(){
    let data = {
      "columnProperties": [
          {
              "columnName": "Doc ID",
              "field": "Doc ID",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Case_ID",
              "field": "Case_ID",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Doc Name",
              "field": "Doc Name",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Case ID",
              "field": "Case ID",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Pages",
              "field": "Pages",
              "dataType": "int",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Created Date",
              "field": "Created Date",
              "dataType": "Date",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },          
          {
              "columnName": "Completed Date",
              "field": "Completed Date",
              "dataType": "Date",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Status",
              "field": "Status",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
              "columnName": "Case Owner",
              "field": "Owner",
              "dataType": "nvarchar",
              "visibilityFlag": "Y",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
              "selectDropdown": "N"
          },
          {
            "columnName": "Current Priority",
            "field": "Priority",
            "dataType": "nvarchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "selectDropdown": "N"
          },
          {
            "columnName": "New Priority",
            "field": "Priority",
            "dataType": "nvarchar",
            "visibilityFlag": "Y",
            "editable": "N",
            "action": "N",
            "statusIcon": "N",
            "dynamicStatusIcon": null,
            "hyperlink": "N",
            "checkboxSelection": "N",
            "selectDropdown": "Y"
          },
          {
              "columnName": "Business Status",
              "field": "Business Status",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Current Task",
              "field": "Current Task",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "File Location",
              "field": "File Location",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Owner Id",
              "field": "Case Owner Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Manager Id",
              "field": "Case Manager Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Supervisor Id",
              "field": "Case Supervisor Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Case Assignee Id",
              "field": "Case Assignee Id",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Row Colour",
              "field": "Row Colour",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Process Flag",
              "field": "Process Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Delete Doc Flag",
              "field": "Delete Doc Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Set Priority Flag",
              "field": "Set Priority Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Assign/Reassign Flag",
              "field": "Assign/Reassign Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          },
          {
              "columnName": "Update Status Flag",
              "field": "Update Status Flag",
              "dataType": "nvarchar",
              "visibilityFlag": "N",
              "editable": "N",
              "action": "N",
              "statusIcon": "N",
              "dynamicStatusIcon": null,
              "hyperlink": "N",
              "checkboxSelection": "N",
"selectDropdown": "N"
          }
      ],
      "GridData": []
    }
    if(this.Data.caseDetail && this.Data.caseDetail.length > 0){
      this.Data.caseDetail.map(item => {
        item.hyperlinkIcon = '';
      });
    }
    data.GridData = this.Data.caseDetail
   return data;
   }

  getTitleContainerClass(): string {
    switch (this.Data.titlePosition) {
      case 'right':
        return 'title-container-right';
      case 'left':
        return 'title-container-left';
      default:
        return 'title-container-center';
    }
  }
  getContentContainerClass(): string {
    switch (this.Data.contentPosition) {
      case 'right':
        return 'title-container-right';
      case 'left':
        return 'title-container-left';
      case 'center':
        return 'title-container-center';
      default:
        return '';
    }
  }
  getButtonContainerClass(): string {
    switch (this.Data.buttonPosition) {
      case 'right':
        return 'title-container-right';
      case 'left':
        return 'title-container-left';
      default:
        return 'title-container-center';
    }
  }
  onAdditionalButtonClick(action: string): void {
    // Handle the button action based on the provided action string
    switch (action) {
      case 'later':
        // Handle "Later" action
        this.buttonClicked.emit('later');
        //console.log('Later button clicked');
        this.dialogRef.close(true);
        break;
      case 'save':
        // Handle "Save" action
        //console.log('Save button clicked');
        this.buttonClicked.emit('save');
        this.dialogRef.close(true);
        break;
      // Add cases for other button actions if needed
      case 'AssignOwner':
        // Handle "Save" action
        //console.log('Save button clicked');
        let obj = {
          ownerlist: this.ownerAssignee
        }
        // this.buttonClicked.emit(action);
        // this.dialogRef.close(obj);
        this.loaderService.showLoader();
        this.customButtonClicked.emit(obj);
        break;
        case 'AssignOwnerTask':
        // Handle "Save" action
        //console.log('Save button clicked');
        let obj2 = {
          ownerlist: this.ownerAssigneeTask
        }
        // this.buttonClicked.emit(action);
        // this.dialogRef.close(obj);
        this.loaderService.showLoader();
        this.customButtonClicked.emit(obj2);
        break;
      // Add cases for other button actions if needed
      case 'SetPriority':
        // Handle "Save" action
        //console.log('Save button clicked');
        let obj1 = {
          ownerlist: this.setPriorityList
        }
        this.loaderService.showLoader();
        this.customButtonClicked.emit(obj1);
        // this.dialogRef.close(resp);
        // this.buttonClicked.emit(action);
        // this.dialogRef.close(obj1);
        break;
      // Add cases for other button actions if needed
      default:
        // Handle default action
        this.buttonClicked.emit(action);
        this.dialogRef.close(true);
        break;
    }
  }
  onAcceptClick(): void {
    
    if(this.Data.type === 'Assign/Reassign') {
      this.buttonClicked.emit('accept');
      if((this.selectSupervisor && this.selectSupervisor != "") || (this.selectSupervisor && this.selectSupervisor != undefined) || (this.selectSupervisor && this.selectSupervisor != null) ) {
       let reqObj = {
         caseId: this.Data.caseDetail['Case ID'],
         caseOwnerId: this.selectOwner,
         caseSupervisorId: this.selectSupervisor,
         token:"t2k7jHs13XuW0O7MufPn0mbcNwuwgdkkPuY1UPAoFTRUpohY/x/c4r7Dp3mRVmq8"
        }
        this.service.updateBulkCaseAssignee(reqObj).subscribe(resp => {
          this.loaderService.showLoader();
          this.customButtonClicked.emit(resp);
          // this.dialogRef.close(resp);
        })
      } 
      
    } else if(this.Data.type === 'Add Filter') {
      this.dialogRef.close(this.availableFields);
    } else if (this.Data.type === 'Settings'){
      let output = this.data.allocationDetails;
      if(this.data.DelegateAdmin){
        if(!this.hasObjectsWithEmptyKeys(output.temporaryAdminDetails)){
          output.temporaryAdminDetails = this.modifyObjectsBasedOnConditions(output.temporaryAdminDetails)
          this.loaderService.showLoader();
          this.customButtonClicked.emit(output);
          // this.dialogRef.close(output);
        }
      }
      else{
        output.temporaryAdminDetails = [];
        this.loaderService.showLoader();
        this.customButtonClicked.emit(output);
        // this.dialogRef.close(output);
      }
    }
    
  }
  modifyObjectsBasedOnConditions(objects) {
    return objects.map(obj => {
      // Modify key1 based on another array of objects
      const match = this.data.teamMemberDetails.find(item => item.userName == obj.team_member_user_id);
      if (match) {
        obj.team_member_user_id = match.userId; 
      }
      obj.start_date = this.datePipe.transform( new Date(obj.start_date), 'MM/dd/yyyy'); 
      if (obj.enable_flag !== 'Y') {
        obj.expiry_date = this.datePipe.transform( new Date(obj.expiry_date), 'MM/dd/yyyy'); 
      }
  
      return obj;
    });
  }
  hasObjectsWithEmptyKeys(objects): boolean {
    return objects.some(obj => {
      const startDateValid = moment(obj.start_date, 'MM/DD/YYYY', true).isValid();
      const expiryDateValid = moment(obj.expiry_date, 'MM/DD/YYYY', true).isValid();
  
      if (obj.enable_flag === 'Y') {
        return !obj.team_member_user_id || !startDateValid;
      } else {
        return !obj.team_member_user_id || !startDateValid || !expiryDateValid;
      }
    });
  }
  onDeclineClick(): void {
    this.buttonClicked.emit('decline');
    this.dialogRef.close();
  }
  onClose(): void {
    this.dialogRef.close();
  }

  assignReassign() {
    let reqObj = 
      {
        token:"t2k7jHs13XuW0O7MufPn0mbcNwuwgdkkPuY1UPAoFTRUpohY/x/c4r7Dp3mRVmq8",
        caseTemplatecode: this.Data.caseDetail['Case Template Code']
    }
    this.service.getAssignReassignCasesLookups(reqObj).subscribe(resp=>{
      this.caseOwnerList = resp['Case Owner List'];
      this.caseSupervisorList = resp['Case Supervisor List'];
      this.selectOwner = this.Data.caseDetail['Case Owner Id'];
      this.selectSupervisor = this.Data.caseDetail['Case Supervisor Id'];
    })
  }

  updateSLABuildForm() {
    this.updateSLAForm = this.formbuilder.group({
      orginalDueDate: ['', Validators.required],
      revisedDueDate: ['', Validators.required]
    });
  }
  // Function to determine checkbox state based on autoAllocationStatus
  getCheckBoxValue(autoAllocationStatus: string): boolean {
    return autoAllocationStatus === 'Y' ? true : false;
  }

  // Function to set autoAllocationStatus based on checkbox state
  setCheckBoxValue(event: boolean) {
    this.data.allocationDetails.autoAllocationStatus = event ? 'Y' : 'N';
    // this.data.DelegateAdmin = event ? false : true;
  }
  // Function to set autoAllocationStatus based on checkbox state
  setCheckBoxStatus(event: boolean) {
    if(event == false){
      this.disableSettingsAcceptBtn = false;
    }
    // this.data.allocationDetails.autoAllocationStatus = event ? 'N' : 'Y';
    if(this.data.allocationDetails.temporaryAdminDetails.length == 0){
      const newObj = { team_member_user_id: '', start_date: new Date(), expiry_date: '', enable_flag: 'Y', };
      this.data.allocationDetails.temporaryAdminDetails.push(newObj);
    }
  }
  // Function to determine checkbox state based on autoAllocationStatus
  getCheckBoxValueForFlag(enable_flag: string): boolean {
    return enable_flag === 'Y' ? true : false;
  }

  // Function to set autoAllocationStatus based on checkbox state
  setCheckBoxValueForFlag(event: boolean): string {
    return event ===  true ? 'Y': 'N';
  }
  getExpiryDateDisableStatus(enable_flag: string, index: number): boolean{
    if(enable_flag ===  'Y') {
      this.data.allocationDetails.temporaryAdminDetails[index].expiry_date = ''
    }
    return enable_flag ===  'Y' ? true: false;
  }
  /*
      *** Set Date after date pipe convert ***
  */
  onChangeDate(e: any, value: string): string {
    if(e && moment(e).isValid()){
      return value = this.datePipe.transform( new Date(e), 'MM/dd/yyyy')
    }
    else{
      return value;
    }
  }

  /*
      *** Set Date after date pipe convert ***
  */
  onChangeDateInput(e: any, value: string): string {
    if(e && moment(e).isValid()){
      return value = this.datePipe.transform( new Date(e), 'MM/dd/yyyy')
    }
    else{
      return e;
    }
  }
  formatDate(date: Date): any {
    return new FormControl(moment(date));
  }
  /*
      *** Set Datepicker minimum validation Date format ***
  */
  getMinDate(input: string): Date{
    let date: Date;
    if(input !== null && input !== undefined && input !== ''){
      const customPipe = new DateConvertPipe();
      let tempDate: Date | string = customPipe.transform(input, 'MM/dd/yyyy');
      date = tempDate as Date;
    }
    else{
      date = new Date();
    }
    return date;
  }

  /*
      *** Set Datepicker Maximum validation Date format ***
  */
  getMaxDate(input: string): Date | null{
    let date: Date;
    if(input !== null && input !== undefined && input !== ''){
      const customPipe = new DateConvertPipe();
      let tempDate: Date | string = customPipe.transform(input, 'MM/dd/yyyy');
      date = tempDate as Date;
    } 
    else {
      return null; // Return null if input is empty
    }
    return date;
  }
  addObject(): void {
    const newObj = { team_member_user_id: '', start_date: new Date(), expiry_date: '', enable_flag: 'Y', };
    this.data.allocationDetails.temporaryAdminDetails.push(newObj);
  }

  deleteObject(index: number): void {
    this.data.allocationDetails.temporaryAdminDetails.splice(index, 1);
    if(this.data.allocationDetails.temporaryAdminDetails.length == 0){
      this.data.DelegateAdmin = false;
      this.disableSettingsAcceptBtn = false;
    }
  }
  getTeamMember(input): any  {
    const member = this.data.teamMemberDetails.find(member => member.userId === input);
    return member ? member.userName : '';
    // if(input !== null && input !== undefined && input !== '' && this.data.teamMemberDetails && this.data.teamMemberDetails.length > 0){
    //   let response: string = '';
    //   this.data.teamMemberDetails.forEach(member => {
    //     if(input == member.userId){
    //       response = member.userName
    //     }
    //   });
    //   return response;
    // }
    // else{
    //   return '';
    // }
  }
  setTeamMember(input): string {
    const member = this.data.teamMemberDetails.find(member => member.userName === input);
    return member ? member.userId : '';
  }
  getDelegateAdminErrorMessage(): boolean{ 
    if(this.hasObjectsWithEmptyKeys(this.data.allocationDetails.temporaryAdminDetails)){
      this.disableSettingsAcceptBtn = true;
      return true;
    }
    else{
      this.disableSettingsAcceptBtn = false;
      return false;
    }
  }

  cellDropDownEmit(event) {
    if(event.type == 'AssignReAssignGrid') {
      if(this.ownerAssignee.length != 0) {
        this.ownerAssignee.map(item=>{
          if(item.case_id == event.case_id) {
            item.owner_id = event.owner_id
          } else {
            this.ownerAssignee.push(event);
          }
        })
      } else {
        this.ownerAssignee.push(event);
      }
    } else if(event.type == 'AssignReAssignTaskGrid') {
      if(this.ownerAssigneeTask.length != 0) {
        this.ownerAssigneeTask.map(item=>{
          if(item.task_id == event.task_id) {
            item.owner_id = event.owner_id
          } else {
            this.ownerAssigneeTask.push(event);
          }
        })
      } else {
        this.ownerAssigneeTask.push(event);
      }
    } else if(event.type == 'SetPriorityGrid') {
      if(this.setPriorityList.length != 0) {
        this.setPriorityList.map(item=>{
          if(item.case_id == event.case_id) {
            item.priority = event.priority
          } else {
            this.setPriorityList.push(event);
          }
        })
      } else {
        this.setPriorityList.push(event);
      }
    }
    
   
  }

  loadInsightsGrid(){
    this.WorkqueueButtonList = this.data.btnList;
    this.gridWidget = this.data.gridWidget;
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

}
