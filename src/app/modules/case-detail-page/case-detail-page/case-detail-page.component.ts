import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import moment from 'moment';
import { DateConvertPipe } from 'src/app/shared/pipe/date-convert-pipe';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { PopupCustomComponent } from '../../shared-module/popup-custom/popup-custom.component';
import { MatDialog } from '@angular/material/dialog';
import { IDynamicDialogConfig, PopupSuccessComponent } from '../../shared-module/popup-success/popup-success.component';
import { Router } from '@angular/router';

/*
    *** Custom Dictionary declaration ***
*/
interface customDictionary {
  [index: string]: string | boolean | number | string[] | number[] | customDictionary | customDictionary[];
}
/*
    *** Custom Overall Input Class declaration ***
*/
interface InputObj 
{ 
  Type: string;
  Class: string;
  FieldType: string;
  FieldId?: string;
  Hide: string;
  Editable: string;
  Label: string;
  Value;
  TempValue: string | boolean | number;
  originalValue?: string | boolean | number;
  id: string;
  Level: number;
  index: number;
  PlaceHolder: string;
  icon: string;
  Hint: string[];
  Tooltip: string;
  ConfidenceType: string;
  dataType?: string;
  VisibilityFlag?: string;
  columnProperties: customDictionary[];
  GridData: customDictionary[];
  Dimensions?: customDictionary[];
  IntelliSearchData: IntelliSearchData[];
  ValidationData: ValidationData[];
  AdditionalData: AdditionalData[];
  Attributes: Attributes[];
  Child: InputObj[];
  accordianOpen?: boolean;
  loadgrid?: boolean;
};

/*
    *** Custom IntelliSearchData Input Class declaration ***
*/
interface IntelliSearchData
{ 
  Label: string;
  id: string;
  searchGroup: string;
  Type: string;
  IntelliSearchAPI: string;
  IntelliSearchInput: customDictionary;
  Data: string[];
};
  
/*
    *** Custom IntelliSearchData Input Class declaration ***
*/
interface ValidationData
{ 
  RuleID: number;
  id: string;
  RuleType: string;
  ValidationInput: string;
  ErrorMessage: string;
};
  
/*
    *** Custom AdditionalData Input Class declaration ***
*/
interface AdditionalData
{ 
  Type: string;
  Class: string;
  FieldType: string;
  Hide: string;
  Editable: string;
  Label: string;
  Value;
	TempValue: string | boolean | number;
  id: string;
  Level: number;
  index: number;
  PlaceHolder: string;
  icon: string;
  Hint: string[];
  Tooltip: string;
  ConfidenceType: string;
  dataType?: string;
  VisibilityFlag?: string;
  Dimensions: customDictionary[];
  IntelliSearchData: IntelliSearchData[];
  ValidationData: ValidationData[];
  AdditionalData: AdditionalData[];
  Attributes: Attributes[];
  Child?: InputObj[];
};
  
/*
    *** Custom AdditionalData Input Class declaration ***
*/
interface Attributes
{ 
  Label: string;
  Value: string | boolean;
  Version: string | boolean | number;
  user: string;
  time: string;
  id: string;
  index: number;
};
  
/*
    *** Output Class declaration ***
*/
interface OutputObj
{ 
	Type: string;
	FieldType: string;
	Label: string;
	Value;
	TempValue: string | boolean | number;
	id: string;
	Level: number;
	index: number;
  ConfidenceType: string;
  Dimensions: customDictionary[];
	IntelliSearchData: IntelliSearchData[];
	ValidationData: ValidationData[];
	AdditionalData: AdditionalData[];
	Attributes: Attributes[];
	CompleteJson:  InputObj[];
}
  
/*
    *** Custom Output Class declaration ***
*/
interface CustomOutput
{ 
  CustomEvent: string,
  Value;
  Data: OutputObj[]
}


@Component({
  selector: 'app-case-detail-page',
  templateUrl: './case-detail-page.component.html',
  styleUrls: ['./case-detail-page.component.scss']
})
export class CaseDetailPageComponent {
/*
      *** Input decorator declaration ***
  */
  @Input() PageFieldType: string;
  /*
      *** Output decorator declaration ***
  */
  /*
      *** ViewChildren decorator declaration ***
  */
  @ViewChildren('Field') Fields: QueryList<ElementRef>;
  /*
      *** Variable declaration ***
  */
  inputJson: InputObj[];
  dataLoaded: boolean = false;
  TaskListGridWidget: EcareGridSettings;
  loadTaskListGrid: boolean = true;
  gridData: { columnProperties: []; GridData: []; };
  disableBtnStatus: boolean = true;
  loadGrid: boolean = false;
  ownerData: any;
  selectedRowDetails: any;
  
  constructor(
    private sharedService: SharedServiceService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private sessionStorage: SessionStorageService,
    private loaderService: CommonLoaderService,
    public dialog: MatDialog,
    public router: Router,
    ) {}
  
  /*
     *** Ng Oninit ***
  */
  ngOnInit(): void{
    this.loadGrid = false;
    let selectedCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
    this.GetCaseDetailsValue(selectedCaseDetails['Batch_ID']);
  }
  /*
      *** Dynamic Entry Page Select EventEmitter ***
  */

  GetCaseDetailsValue(BatchID) {
    let reqObj = {
      batchId: BatchID
    }
    this.sharedService.getBatchDetailsValue(reqObj).subscribe({
        next: (value: any) => {
          // Handle 'next' callback
          this.inputJson = [];
          if(value){
            if(value.MetaData && value.MetaData.length){
              let counter: number = 0;
              value.MetaData.forEach(element => {
                if(element.Dataset_Metadata){
                  // console.log(element.Dataset_Metadata);
                  if(value[element.Dataset_Metadata]){
                    let inputKeyObject: InputObj = {
                      Type: 'Accordian',
                      FieldType: "",
                      Label: element.Dataset_Metadata,
                      Value: '',
                      TempValue: "",
                      id: counter.toString(),
                      Attributes: [],
                      Hide: 'N',
                      Editable: '',
                      PlaceHolder: element.Dataset_Metadata,
                      icon: '',
                      Hint: [],
                      Tooltip: '',
                      ValidationData: [],
                      accordianOpen: true,
                      Child: [],
                      Class: '',
                      Level: 0,
                      index: 0,
                      ConfidenceType: '',
                      Dimensions: [],
                      IntelliSearchData: [],
                      AdditionalData: [],
                      originalValue: '',
                      dataType: '',
                      VisibilityFlag: '',
                      columnProperties: [],
                      GridData: []
                    }
                    counter++
                    let keys = Object.keys(value[element.Dataset_Metadata]);
                    let keyCounter: number = 0;
                    keys.forEach(key => {
                      let inputObject: InputObj = {
                        Type: "Field",
                        FieldType: "Input",
                        Label: key,
                        Value: value[element.Dataset_Metadata][key],
                        TempValue: "",
                        id: keyCounter.toString(),
                        Attributes: [],
                        Hide: 'N',
                        Editable: '',
                        PlaceHolder: '',
                        icon: '',
                        Hint: [],
                        Tooltip: '',
                        ValidationData: [],
                        accordianOpen: false,
                        Child: [],
                        Class: '',
                        Level: 0,
                        index: 0,
                        ConfidenceType: '',
                        Dimensions: [],
                        IntelliSearchData: [],
                        AdditionalData: [],
                        originalValue: '',
                        dataType: '',
                        VisibilityFlag: '',
                        columnProperties: [],
                        GridData: []
                      }
                      inputKeyObject.Child.push(inputObject);
                      keyCounter++;
                    });
                    this.inputJson.push(inputKeyObject);
                  }
                  if(element.Dataset_Metadata === 'Task List'){
                    let inputKeyObject: InputObj = {
                      Type: 'Label',
                      FieldType: "",
                      Label: element.Dataset_Metadata,
                      Value: '',
                      TempValue: "",
                      id: counter.toString(),
                      Attributes: [],
                      Hide: 'N',
                      Editable: '',
                      PlaceHolder: '',
                      icon: '',
                      Hint: [],
                      Tooltip: '',
                      ValidationData: [],
                      accordianOpen: false,
                      Child: [],
                      Class: '',
                      Level: 0,
                      index: 0,
                      ConfidenceType: '',
                      Dimensions: [],
                      IntelliSearchData: [],
                      AdditionalData: [],
                      originalValue: '',
                      dataType: '',
                      VisibilityFlag: '',
                      columnProperties: [],
                      GridData: []
                    }
                    counter++
                    let keyCounter: number = 0;
                    let inputObject: InputObj = {
                      Type: "Field",
                      FieldType: "Grid",
                      Label: '',
                      Value: '',
                      TempValue: "",
                      id: keyCounter.toString(),
                      Attributes: [],
                      Hide: 'N',
                      Editable: '',
                      PlaceHolder: '',
                      icon: '',
                      Hint: [],
                      Tooltip: '',
                      ValidationData: [],
                      accordianOpen: false,
                      Child: [],
                      Class: '',
                      Level: 0,
                      index: 0,
                      ConfidenceType: '',
                      Dimensions: [],
                      IntelliSearchData: [],
                      AdditionalData: [],
                      originalValue: '',
                      dataType: '',
                      VisibilityFlag: '',
                      columnProperties: value.columnProperties,
                      GridData: value.GridData
                    }
                    inputKeyObject.Child.push(inputObject);
                    keyCounter++;
                    this.inputJson.push(inputKeyObject);
                  }
                }
              });
            }
            // value.columnProperties.map(data => {
            //   data.field = data.columnName;
            // });
            // this.gridData = {
            //   columnProperties: value.columnProperties,
            //   GridData: value.GridData
            // }
          }
          // this.editCaseHeader = true
        },
        error: (error: any) => {
            // Handle 'error' callback
        },
        complete: () => {
            // Handle 'complete' callback
            this.dataLoaded = true;
            this.loaderService.hideLoader();
            this.loadGrid = true;
        }
      });

  }
  
  gridApiData(columnProperties, GridData, id): EcareGridSettings{
    let GridSettings: EcareGridSettings = {
      localjson: {
        columnProperties: columnProperties,
        GridData: GridData
      },
      id: id,
      checklocaljson : true,
      rowSelection: 'multiple',
      gridname: 'CaseDetail ' + this.PageFieldType
    }
    return GridSettings;
  }
  

  /*
      *** Value Selected ***
  */
  ValueSelected(Type: string, FieldType: string, Value, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number, ConfidenceType: string, Dimensions: customDictionary[]): void {
    //IntelliSearch Logics
    if(FieldType === "Input"){
      IntelliSearchData.map((IntelliSearch: IntelliSearchData) => {
        if(IntelliSearch.Type === "API"){
          (IntelliSearch.Data as string[]) = this.getIntelliSearchData(IntelliSearch.IntelliSearchAPI as string, IntelliSearch.IntelliSearchInput as customDictionary, Value);
        };
      });
    }
    //Select Logics
    let Output: OutputObj = {
      Type: Type,
      FieldType: FieldType,
      Label: Label,
      Value: Value,
      TempValue: TempValue,
      id: id,
      Level: Level,
      index: index,
      IntelliSearchData: IntelliSearchData,
      ValidationData: ValidationData,
      AdditionalData: AdditionalData,
      Attributes: Attributes,
      CompleteJson: this.inputJson,
      ConfidenceType: ConfidenceType,
      Dimensions: Dimensions
    }
  }

  /*
      *** Save Value ***
  */
  SaveValue(Type: string, FieldType: string, Value, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number, ConfidenceType: string, Dimensions: customDictionary[], originalValue: string | boolean | number): void {
    //IntelliSearch Logics
    if(FieldType === "Input"){
      IntelliSearchData.map((IntelliSearch: IntelliSearchData) => {
        if(IntelliSearch.Type === "API"){
          (IntelliSearch.Data as string[]) = this.getIntelliSearchData(IntelliSearch.IntelliSearchAPI as string, IntelliSearch.IntelliSearchInput as customDictionary, Value);
        };
      });
    }
    //Save Logics
    let errorData: { errorMessage: string[]; id: string; } = this.getErrorMessage(Type, FieldType, Value, Label, id, Level, index, IntelliSearchData, ValidationData, Attributes, AdditionalData , TempValue);
    if(errorData.id === id && errorData.errorMessage.length === 0 && Value != originalValue){
      let Output: OutputObj = {
        Type: Type,
        FieldType: FieldType,
        Label: Label,
        Value: Value,
        TempValue: TempValue,
        id: id,
        Level: Level,
        index: index,
        IntelliSearchData: IntelliSearchData,
        ValidationData: ValidationData,
        AdditionalData: AdditionalData,
        Attributes: Attributes,
        CompleteJson: this.inputJson,
        ConfidenceType: ConfidenceType,
        Dimensions: Dimensions
      }
      // this.SaveEventEmitter.emit(Output);
    }
  }

  /*
      *** Return Error Message ***
  */
  getErrorMessage(Type: string, FieldType: string, Value, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number): { errorMessage: string[]; id: string; } {
    let errorMessage: { errorMessage: string[]; id: string; } = {
      errorMessage: [],
      id: id
    };
    if(ValidationData && ValidationData.length){
      ValidationData.map((data: any) => {
        if(data.RuleID === 1 && data.RuleType === "Required"){
          if(!Value && Value === ""){
            if(FieldType === "Checkbox"){
              if(Attributes.length){
                if(Attributes.every(({ Value }) => !Value)){
                  errorMessage.errorMessage.push(data.ErrorMessage);
                };
              }
            }
            else{
              errorMessage.errorMessage.push(data.ErrorMessage);
            }
          }
        }
        if(data.RuleID === 2 && data.RuleType === "Validation"){
          if(FieldType === "Datepicker"){
            if(TempValue){
              if(!moment((TempValue as string), data.ValidationInput, true).isValid()){
                errorMessage.errorMessage.push(data.ErrorMessage);
              };
            }
            else{
              if(!moment((Value as string), data.ValidationInput, true).isValid()){
                errorMessage.errorMessage.push(data.ErrorMessage);
              };
            }
          }
          if (FieldType === "Input" || FieldType === "Textarea") {
            const regExp = new RegExp(data.ValidationInput)
            if(!regExp.test(Value as string)){
              errorMessage.errorMessage.push(data.ErrorMessage);
            }
          }
        }
        if(data.RuleID === 3 && data.RuleType === "Minimum"){
          if (FieldType === "Input" || FieldType === "Textarea") {
            let tempValue: string = Value as string;
            if(tempValue && tempValue.length < Number(data.ValidationInput)){
              errorMessage.errorMessage.push(data.ErrorMessage);
            }
          }
          if(FieldType === "Datepicker"){
            const customPipe = new DateConvertPipe();
            let tempDate: Date | string = customPipe.transform(data.ValidationInput, 'MM/dd/yyyy');
            let tempIpDate: Date | string = customPipe.transform(Value as string, 'MM/dd/yyyy');
            if(tempDate > tempIpDate){
              errorMessage.errorMessage.push(data.ErrorMessage);
            }
          }
        }
        if(data.RuleID === 4 && data.RuleType === "Maximum"){
          if (FieldType === "Input" || FieldType === "Textarea") {
            let tempValue: string = Value as string;
            if(tempValue && tempValue.length > Number(data.ValidationInput)){
              errorMessage.errorMessage.push(data.ErrorMessage);
            }
          }
          if(FieldType === "Datepicker"){
            const customPipe = new DateConvertPipe();
            let tempDate: Date | string = customPipe.transform(data.ValidationInput, 'MM/dd/yyyy');
            let tempIpDate: Date | string = customPipe.transform(Value as string, 'MM/dd/yyyy');
            if(tempDate < tempIpDate){
              errorMessage.errorMessage.push(data.ErrorMessage);
            }
          }
        }
      });
    }
    return errorMessage;
  }

  /*
      *** Set Date after date pipe convert ***
  */
  onChangeDate(e: any, Value): string {
    if(e && moment(e).isValid()){
      return Value = this.datePipe.transform( new Date(e), 'MM/dd/yyyy')
    }
    else{
      return Value as string;
    }
  }

  /*
      *** Set Date after date pipe convert ***
  */
  onChangeDateInput(e: any, Value): string {
    if(e && moment(e).isValid()){
      return Value = this.datePipe.transform( new Date(e), 'MM/dd/yyyy')
    }
    else{
      return e;
    }
  }

  /*
      *** Intelligent Search API Call ***
  */
  getIntelliSearchData(requestUrl: string, apiInput: customDictionary, Value): string[]{
    apiInput = {
      "Lookupname": ""
    };
    let output: string[] = [];
    let params: customDictionary = apiInput;
    this.http.post(requestUrl, params).subscribe({
      next: (response: customDictionary[]) => {
          // Handle 'next' callback
          if(response && response.length){
            response.map((data: customDictionary) => {
              output.push(data.Value as string)
            });
          }
      },
      error: (error) => {
          // Handle 'error' callback
      },
      complete: () => {
          // Handle 'complete' callback
      }
    });
    return output;
  }

  /*
      *** Set Datepicker minimum validation Date format ***
  */
  getMinDate(ValidationData: ValidationData[]): Date{
    let date: Date;
    if(ValidationData && ValidationData.length){
      ValidationData.map((data: any) => {
        if(data.RuleID === 3 && data.RuleType === "Minimum"){
          const customPipe = new DateConvertPipe();
          let tempDate: Date | string = customPipe.transform(data.ValidationInput, 'MM/dd/yyyy');
          date = tempDate as Date;
        }
      });
    }
    return date;
  }

  /*
      *** Set Datepicker Maximum validation Date format ***
  */
  getMaxDate(ValidationData: ValidationData[]): Date{
    let date: Date;
    if(ValidationData && ValidationData.length){
      ValidationData.map((data: any) => {
        if(data.RuleID === 4 && data.RuleType === "Maximum"){
          const customPipe = new DateConvertPipe();
          let tempDate: Date | string = customPipe.transform(data.ValidationInput, 'MM/dd/yyyy');
          date = tempDate as Date;
        }
      });
    }
    return date;
  }

  /*
      *** Slide Toggle EventEmitter ***
  */
  SlideToggleEventEmitter(Value: boolean, CurrentInput: InputObj[]): void{
    let Output: CustomOutput = {
      CustomEvent: "SlideToggle",
      Value: Value,
      Data: []
    };
    CurrentInput.forEach(element => {
      Output.Data.push({
        Type: element.Type,
        FieldType: element.FieldType,
        Label: element.Label,
        Value: element.Value,
        TempValue: element.TempValue,
        id: element.id,
        Level: element.Level,
        index: element.index,
        IntelliSearchData: element.IntelliSearchData,
        ValidationData: element.ValidationData,
        AdditionalData: element.AdditionalData,
        Attributes: element.Attributes,
        CompleteJson: this.inputJson,
        ConfidenceType: element.ConfidenceType,
        Dimensions: element.Dimensions
      });
    });
    // this.CustomEventEmitter.emit(Output);
  }
  
  /*
      *** focus Field By ID ***
  */
  focusFieldByID(ID: string): void {
    if (this.Fields && this.Fields.length) {
      const inputElement = this.Fields.find(el => el.nativeElement.id === ID);
      if (inputElement) {
        inputElement.nativeElement.focus();
        inputElement.nativeElement.scrollIntoView();
      }
    }
  }
  handleCheckBoxEvent(event){
    this.disableBtnStatus = true;
    this.selectedRowDetails = event.selectedRowDetails;
    if (event['selectedRowCount'] > 0) {
      let mergedObject = event.selectedRowDetails.reduce((result, current) => {
        Object.entries(current).forEach(([key, value]) => {
            if (!result.hasOwnProperty(key) || value === "Completed") {
              result[key] = value;
            }
          });
          return result;
        }, {});
      if(mergedObject){
        if(mergedObject.Status == 'Completed'){
          this.disableBtnStatus = true;
        }
        else{
          this.disableBtnStatus = false;
        }
      }
    } 
    else {
      this.disableBtnStatus = true;
    }
  }

  assignRessign() {
    let reqObj = {
      "lookupCode": "Case Owner"
    }
    this.sharedService.getWorkQueueFilterLookupValues(reqObj).subscribe({
      next:  (response) => {
        this.ownerData = response;         
        this.ownerData.map(item=>{
          item.id = item.lookupCode,
          item.value = item.lookupName
        })
      },
       error:  (error) => {},
      complete:()=>{ 
        const dialogRef = this.dialog.open(PopupCustomComponent, {
          data: {
            type : 'Assign/Reassign Task',
            title: 'Assign/Reassign',
            titlePosition: 'left',
            // contentPosition: 'center',
            buttonPosition: 'right',
            additionalButtons: [
              {
                label: 'Assign/Reassign',
                action: 'AssignOwnerTask'
              }
            ],
            acceptButtonTitle: 'Assign',
            declineButtonTitle: 'Cancel',
            showDeclineButton: true,
            showClose: true,
            caseDetail: this.selectedRowDetails,
            ownerDetails: this.ownerData 
          },
          height: 'auto',
          width: '1100px',
          // position: {
          //     top: `${ 24 }px`
          //   },
        });
        dialogRef.disableClose = true;
    
        dialogRef.componentInstance.customButtonClicked.subscribe(obj => {
            if(obj) {
              obj.ownerlist = obj.ownerlist.filter(obj => obj.owner_id !== '');
              obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'task_id');
              if(obj.ownerlist.length != 0) {
                let reqObj = obj.ownerlist;
          
                this.sharedService.multipleTaskAssign(reqObj).subscribe({
                  next:  (response) => {
                  },
                    error:  (error) => {
                    dialogRef.close();
                  },
                  complete:()=>{ 
                    this.loaderService.hideLoader();
                    dialogRef.close();
                    const dialogRef2 = this.dialog.open(PopupSuccessComponent, {
                      // panelClass: '',
                      data: <IDynamicDialogConfig>{
                        title: 'Success',
                        titleFontSize:'20',
                        type : '',
                        titlePosition: 'left',
                        contentPosition: 'left',
                        dialogContentFontSize: '15',
                        dialogContent: 'Selected Task(s) Assigned/Reassigned Successfully.',
                        additionalButtons: [],
                        showAcceptButton: true,
                        acceptButtonTitle: 'Okay',
                        buttonPosition: 'right',
                        declineButtonTitle: '' ,
                        caseDetail: '',
                        fileDetails: '',
                        showClose: false
                        },
                        height: 'auto',
                        width: '450px',
                        // position: {
                        //     top: `${ 24 }px`
                        //   },
                    });
                    dialogRef2.disableClose = true;
                
                    dialogRef2.afterClosed().subscribe(result => {
                      if(result) {
                        this.loadGrid = false;
                        let selectedCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
                        this.GetCaseDetailsValue(selectedCaseDetails['Case_ID']);
                      }
                    });
                  }})
                } 
            }
        });
      }})
  }

  updateTaskAssignee(obj) {
    obj.ownerlist = obj.ownerlist.filter(obj => obj.owner_id !== '');
    obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'case_id');
    if(obj.ownerlist.length != 0) {
      let reqObj = obj.ownerlist;

      this.sharedService.multipleTaskAssign(reqObj).subscribe({
        next:  (response) => {
        },
         error:  (error) => {},
        complete:()=>{ 
          let selectedCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
          this.GetCaseDetailsValue(selectedCaseDetails['Case_ID']);
        }})
    }  
  }
  removeDuplicates(array: any[], key: string): any[] {
    const unique = new Map();
    return array.filter(obj => !unique.has(obj[key]) && unique.set(obj[key], 1));
  }

  goToFileList(event) {
    let selectedCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
    let obj = {
      columnName: event.Label == 'Processed Files Count' ? 'Processing File Count' : event.Label == 'Error Files Count' ? 'Error File Count' : event.Label,
      batchId: selectedCaseDetails['Batch_ID'],
      batchNumber: selectedCaseDetails['Batch Number'],          
      columnValueCount: event.Value
    }
    this.sessionStorage.setObj('Selected_Filters_Column', obj);
    this.sessionStorage.setItem('WorkQueueType', 'By Files');
    this.router.navigate(['/filelistdashboard']);
  }
}
