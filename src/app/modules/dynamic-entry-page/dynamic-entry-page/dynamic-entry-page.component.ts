import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChange, ViewChildren, OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { DateConvertPipe } from 'src/app/shared/pipe/date-convert-pipe';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import { environment } from 'src/environments/environments';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { IDynamicDialogConfig, PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';
import { MatDialog } from '@angular/material/dialog';

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
  Hide: string;
  Editable: string;
  Label: string;
  Value: string | boolean | number;
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
  Dimensions: customDictionary[];
  FieldId?: string;
  IntelliSearchData: IntelliSearchData[];
  ValidationData: ValidationData[];
  AdditionalData: AdditionalData[];
  Attributes: Attributes[];
  Child: InputObj[];
  columnProperties?: customDictionary[];
  GridData?: customDictionary[];
  GridAPIInput?: customDictionary[];
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
  Value: string | boolean | number;
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
	Value: string | boolean | number;
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
  Value: string | boolean | number;
  Type: string;
  Data: OutputObj[]
}

interface idArray
{ 
  id: string,
  originalValue: string;
}
interface bulkSaveOutput
{ 
  Type: string,
  Page: number,
  TOR: string,
  DOS: string,
  PageNumbers,
  torId: string,
  lastPage: number,
  CompleteJson:  InputObj[];
}
interface CustomGenericEvent
{
  Type: string,
  Data
}

@Component({
  selector: 'app-dynamic-entry-page',
  templateUrl: './dynamic-entry-page.component.html',
  styleUrls: ['./dynamic-entry-page.component.scss']
})
export class DynamicEntryPageComponent implements OnInit, OnChanges {
  /*
      *** Input decorator declaration ***
  */
  @Input() inputJson: InputObj[];
  @Input() inputGroupId: string;
  @Input() idValueArray: idArray[];
  @Input() PageType: string;
  @Input() screenType: string;
  @Input() PageFieldType: string;
  @Input() CustomInput: customDictionary[];
  @Input() processingCardDetails;
  @Input() RecordNo;
  @Input() TorId;
  @Input() FromPage;
  /*
      *** Output decorator declaration ***
  */
  @Output() SelectEventEmitter = new EventEmitter<OutputObj>();
  @Output() SaveEventEmitter = new EventEmitter<OutputObj>();
  @Output() CustomEventEmitter = new EventEmitter<CustomOutput>();
  @Output() saveRecordDetailsEmitter = new EventEmitter<CustomOutput>();
  @Output() bulkSaveEventEmitter = new EventEmitter<bulkSaveOutput>();
  @Output() closeCompleteEventEmitter = new EventEmitter<string>();
  @Output() CustomGenericEventEmitter = new EventEmitter<any>();
  @Output() RecordNoUpdate = new EventEmitter<any>();
  /*
      *** ViewChildren decorator declaration ***
  */
  @ViewChildren('Field') Fields: QueryList<ElementRef>; 
  @ViewChildren(MatAutocompleteTrigger) autocompleteTriggers: QueryList<MatAutocompleteTrigger>;
  /*
      *** Variable declaration ***
  */
  SlideToggle: boolean = false;
  panelOpen: boolean = true;
  errorMessage: string;
  taskDetails;
  userDetail;
  refreshGrid: boolean = true;
  caseSelected: boolean = false;
  selectedRowDetails: any;
  typeOfRecord: any;
  pageNumbers: any;
  bunchingStartPageNumbers: any;
  overallFieldErrorList: {id: string; error: boolean; }[] = [];
  overallFieldError: boolean = false;
  btnDisableBasedOnBunging = false;

   /**
   * DOB Field Type
   */
  startDOBDateView: 'month' | 'year' | 'multi-year'  = 'multi-year';
  startDate = new Date(2000, 0, 1);
  
  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private sharedService: SharedServiceService,
    private sessionStorage: SessionStorageService,
    private loaderService: CommonLoaderService,
    public dialog: MatDialog,
  ) {};

  ngOnInit(): void {
    this.sessionStorage.setItem('lsLoaded', 'Y');
    this.taskDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    this.userDetail = this.sessionStorage.getObj('currentUser');
    let loadingStatus = this.sessionStorage.getItem('PDFViewerLoaded');
    if(loadingStatus === 'Y'){
      this.loaderService.hideLoader();
    }
    
    let lsPageList = this.getJSONValueBasedOnFieldID('28');
    let lsTOR = this.getJSONValueBasedOnFieldID('26');
    const filteredArray: number[] = this.getPageNumbers(lsPageList);
    let PageNumbers: number[];
    PageNumbers = filteredArray.map(str => Number(str));
    this.RecordNoUpdate.emit({
      index : 0,
      customNavTotalPages : filteredArray.length,
      CustomInputFieldProperties : "readonly",
      CustomInputFieldValue : lsTOR,
      PageNumbers : PageNumbers
    });
  };
  
  ngOnChanges(changes: SimpleChanges): void {
    this.sessionStorage.setItem('lsLoaded', 'Y');
    let loadingStatus = this.sessionStorage.getItem('PDFViewerLoaded');
    if(loadingStatus === 'Y'){
      this.loaderService.hideLoader();
    }
    this.SlideToggle = false;
    this.sessionStorage.setItem('pageBunging', 'false');
    // this.SlideToggleEventEmitter(this.SlideToggle, node.Child)
    
    let lsPageList = this.getJSONValueBasedOnFieldID('28');
    let lsTOR = this.getJSONValueBasedOnFieldID('26');
    const filteredArray: number[] = this.getPageNumbers(lsPageList);
    let PageNumbers: number[];
    PageNumbers = filteredArray.map(str => Number(str));
    this.RecordNoUpdate.emit({
      index : 0,
      customNavTotalPages : filteredArray.length,
      CustomInputFieldProperties : "readonly",
      CustomInputFieldValue : lsTOR,
      PageNumbers : PageNumbers
    });

    this.panelOpen = true;
    setTimeout(() => {
      if (this.Fields && this.Fields.first) {
        this.Fields.first.nativeElement.focus();
      }
      setTimeout(() => {
        this.panelOpen = false;
      }, 900);
    }, 400);
  }
  

  /*
      *** Value Selected ***
  */
  ValueSelected(Type: string, FieldType: string, Value: string | boolean | number, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number, ConfidenceType: string, Dimensions: customDictionary[]): void {
    //IntelliSearch Logics
    if(FieldType === "Input"){
      IntelliSearchData.map((IntelliSearch: IntelliSearchData) => {
        if(IntelliSearch.Type === "API"){
          // (IntelliSearch.Data as string[]) = this.getIntelliSearchData(IntelliSearch.IntelliSearchAPI as string, IntelliSearch.IntelliSearchInput as customDictionary, Value);
          this.getIntelliSearchData(IntelliSearch.IntelliSearchAPI as string, IntelliSearch.IntelliSearchInput as customDictionary, Value)
          .then((data: string[]) => {
            IntelliSearch.Data = data;
          })
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
    this.SelectEventEmitter.emit(Output);
    
    let lsPageList = this.getJSONValueBasedOnFieldID('28');
    let lsTOR = this.getJSONValueBasedOnFieldID('26');
    const filteredArray: number[] = this.getPageNumbers(lsPageList);
    let PageNumbers: number[];
    PageNumbers = filteredArray.map(str => Number(str));
    this.RecordNoUpdate.emit({
      index : 0,
      customNavTotalPages : filteredArray.length,
      CustomInputFieldProperties : "readonly",
      CustomInputFieldValue : lsTOR,
      PageNumbers : PageNumbers
    });
  }

  /*
      *** Save Value ***
  */
  SaveValue(Type: string, FieldType: string, Value: string | boolean | number, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number, ConfidenceType: string, Dimensions: customDictionary[], originalValue: string | boolean | number, FieldId: string): void {
    //IntelliSearch Logics
    // if(FieldType === "Input"){
    //   IntelliSearchData.map((IntelliSearch: IntelliSearchData) => {
    //     if(IntelliSearch.Type === "API"){
    //       (IntelliSearch.Data as string[]) = this.getIntelliSearchData(IntelliSearch.IntelliSearchAPI as string, IntelliSearch.IntelliSearchInput as customDictionary, Value);
    //     };
    //   });
    // }
    if(Label == 'Page Numbers') {
      var pageValue = Value.toString();
      var tempValue = this.removeSpecialCharacters(pageValue);
      Value = tempValue;
        
      let output: CustomGenericEvent = {
        Type: 'PageBunching',
        Data: pageValue
      }
      this.CustomGenericEventEmitter.emit(output);

      const insertValueMainLoop = (node, id, value) => {
        node.forEach(child => insertValue(child, id, value))
        return node
      }
      
      const insertValue = (node, id, value) => {
        const stack = []
        let i
        stack.push(node);
      
        while (stack.length > 0) {
          node = stack.pop();
          if (node.id === id) {
            node.Value = value;
            return node;
          } else if (node.Child?.length) {
            for (i = 0; i < node.Child.length; i++) {
              stack.push(node.Child[i]);
            }
          }
        }
        return null;
      }
       insertValueMainLoop(this.inputJson, id, tempValue);
       
    }

    let lsPageList = this.getJSONValueBasedOnFieldID('28');
    let lsTOR = this.getJSONValueBasedOnFieldID('26');
    if(FieldId == '28'){
      lsPageList = Value as string;
    }
    if(FieldId == '26'){
      lsTOR = Value as string;
    }
    const filteredArray: number[] = this.getPageNumbers(lsPageList);
    let PageNumbers: number[];
    PageNumbers = filteredArray.map(str => Number(str));
    this.RecordNoUpdate.emit({
      index : 0,
      customNavTotalPages : filteredArray.length,
      CustomInputFieldProperties : "readonly",
      CustomInputFieldValue : lsTOR,
      PageNumbers : PageNumbers
    });
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

  removeSpecialCharacters(value) {
    const regex = /^[\W_]+|[\W_]+$/g;
    
    // Replace special characters at the start and end of the string with an empty string
    value = value.replace(regex, '');

    const regex3 = /^[a-zA-Z]+$/g;
    
    value = value.replace(regex3, '');

    // Regular expression to match special characters at the start and end of the string
    const regex1 = /([\W_])\1+/g;
    
    // Replace special characters at the start and end of the string with an empty string
    const tempValue = value.replace(regex1, '$1');

    // Remove all characters except digits, hyphen, and comma
    let cleanedInput = tempValue.replace(/[^\d,-]/g, '');

    let totalPages = this.taskDetails['Pages']

    // Split the input by comma to handle individual numbers or ranges separately
    // Split the input by comma to handle individual numbers or ranges separately
    const parts = cleanedInput.split(',');
    const numbers: number[] = [];
    const uniqueNumbers = new Set<number>();

    // Iterate over each part
    for (let part of parts) {
      // If it's a range, split it and add numbers to the array
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        // Ensure that the range does not exceed the total pages
        for (let i = Math.max(1, start); i <= Math.min(end, totalPages); i++) {
          numbers.push(i);
          uniqueNumbers.add(i);
        }
      } else {
        const num = Number(part);
        // Ensure that the number is greater than zero and does not exceed the total pages
        if (num > 0 && num <= totalPages) {
          numbers.push(num);
          uniqueNumbers.add(num);
        }
      }
    }

    // Sort the numbers and merge overlapping ranges
    const sortedNumbers = [...uniqueNumbers].sort((a, b) => a - b);
    const cleanedRanges: string[] = [];
    let start = sortedNumbers[0];
    let end = start;
    for (let i = 1; i < sortedNumbers.length; i++) {
      if (sortedNumbers[i] === end + 1) {
        end = sortedNumbers[i];
      } else {
        cleanedRanges.push(start === end ? start.toString() : `${start}-${end}`);
        start = end = sortedNumbers[i];
      }
    }
    cleanedRanges.push(start === end ? start.toString() : `${start}-${end}`);

    // Join the cleaned ranges with comma
    return cleanedRanges.join(',');

  }
  /*
      *** Mat auto selected ***
  */
  onOptionSelected(event, Type: string, FieldType: string, Value: string | boolean | number, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number, ConfidenceType: string, Dimensions: customDictionary[], originalValue: string | boolean | number, FieldId: string): void {
    //IntelliSearch Logics
    // if(FieldType === "Input"){
    //   IntelliSearchData.map((IntelliSearch: IntelliSearchData) => {
    //     if(IntelliSearch.Type === "API"){
    //       (IntelliSearch.Data as string[]) = this.getIntelliSearchData(IntelliSearch.IntelliSearchAPI as string, IntelliSearch.IntelliSearchInput as customDictionary, Value);
    //     };
    //   });
    // }
    // console.log(event.option.value);
    // console.log(Value);
    // console.log(originalValue);
    //Save Logics
    this.SaveValue(Type, FieldType, event.option.value, Label, id, Level, index, IntelliSearchData, ValidationData, Attributes, AdditionalData , TempValue, ConfidenceType, Dimensions, originalValue, FieldId)
  }

  /*
      *** Return Error Message ***
  */
  getErrorMessage(Type: string, FieldType: string, Value: string | boolean | number, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number): { errorMessage: string[]; id: string; } {
    let errorMessage: { errorMessage: string[]; id: string; } = {
      errorMessage: [],
      id: id
    };
    if(ValidationData && ValidationData.length){
      ValidationData.map((data: any) => {
        if(data.RuleID === 1){
          if(!Value && Value === ""){
            if(FieldType === "Checkbox"){
              if(Attributes.length){
                if(Attributes.every(({ Value }) => !Value)){
                  errorMessage.errorMessage.push(data.ErrorMessage);
                  if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                    this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                      if(id == err.id){
                        err.error = true;
                      }
                    })
                  }
                  else{
                    let overallFieldErrorObj: {id: string; error: boolean; } = {
                      id: id,
                      error: true
                    };
                    this.overallFieldErrorList.push(overallFieldErrorObj);
                  }
                }
                else{
                  if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                    this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                      if(id == err.id){
                        err.error = false;
                      }
                    })
                  }
                  else{
                    let overallFieldErrorObj: {id: string; error: boolean; } = {
                      id: id,
                      error: false
                    };
                    this.overallFieldErrorList.push(overallFieldErrorObj);
                  }
                }
              }
            }
            else{
              errorMessage.errorMessage.push(data.ErrorMessage);
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = true;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: true
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
          }
          else{
            if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
              this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                if(id == err.id){
                  err.error = false;
                }
              })
            }
            else{
              let overallFieldErrorObj: {id: string; error: boolean; } = {
                id: id,
                error: false
              };
              this.overallFieldErrorList.push(overallFieldErrorObj);
            }
          }
        }
        if(data.RuleID === 2){
          if(FieldType === "Datepicker"){
            if(TempValue){
              if(!moment((TempValue as string), data.ValidationInput, true).isValid()){
                errorMessage.errorMessage.push(data.ErrorMessage);
                if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                  this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                    if(id == err.id){
                      err.error = true;
                    }
                  })
                }
                else{
                  let overallFieldErrorObj: {id: string; error: boolean; } = {
                    id: id,
                    error: true
                  };
                  this.overallFieldErrorList.push(overallFieldErrorObj);
                }
              }
              else{
                if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                  this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                    if(id == err.id){
                      err.error = false;
                    }
                  })
                }
                else{
                  let overallFieldErrorObj: {id: string; error: boolean; } = {
                    id: id,
                    error: false
                  };
                  this.overallFieldErrorList.push(overallFieldErrorObj);
                }
              }
            }
            else{
              if(!moment((Value as string), data.ValidationInput, true).isValid()){
                errorMessage.errorMessage.push(data.ErrorMessage);
                if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                  this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                    if(id == err.id){
                      err.error = true;
                    }
                  })
                }
                else{
                  let overallFieldErrorObj: {id: string; error: boolean; } = {
                    id: id,
                    error: true
                  };
                  this.overallFieldErrorList.push(overallFieldErrorObj);
                }
              }
              else{
                if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                  this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                    if(id == err.id){
                      err.error = false;
                    }
                  })
                }
                else{
                  let overallFieldErrorObj: {id: string; error: boolean; } = {
                    id: id,
                    error: false
                  };
                  this.overallFieldErrorList.push(overallFieldErrorObj);
                }
              }
            }
          }
          if (FieldType === "Input" || FieldType === "Textarea") {
            const regExp = new RegExp(data.ValidationInput)
            if(!regExp.test(Value as string)){
              errorMessage.errorMessage.push(data.ErrorMessage);
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = true;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: true
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
            else{
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = false;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: false
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
          }
        }
        if(data.RuleID === 3){
          if (FieldType === "Input" || FieldType === "Textarea") {
            let tempValue: string = Value as string;
            if(tempValue && tempValue.length < Number(data.ValidationInput)){
              errorMessage.errorMessage.push(data.ErrorMessage);
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = true;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: true
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
            else{
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = false;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: false
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
          }
          if(FieldType === "Datepicker"){
            const customPipe = new DateConvertPipe();
            let tempDate: Date | string = customPipe.transform(data.ValidationInput, 'MM/dd/yyyy');
            let tempIpDate: Date | string = customPipe.transform(Value as string, 'MM/dd/yyyy');
            if(tempDate > tempIpDate){
              errorMessage.errorMessage.push(data.ErrorMessage);
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = true;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: true
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
            else{
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = false;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: false
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
          }
        }
        if(data.RuleID === 4){
          if (FieldType === "Input" || FieldType === "Textarea") {
            let tempValue: string = Value as string;
            if(tempValue && tempValue.length > Number(data.ValidationInput)){
              errorMessage.errorMessage.push(data.ErrorMessage);
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = true;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: true
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
            else{
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = false;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: false
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
          }
          if(FieldType === "Datepicker"){
            const customPipe = new DateConvertPipe();
            let tempDate: Date | string = customPipe.transform(data.ValidationInput, 'MM/dd/yyyy');
            let tempIpDate: Date | string = customPipe.transform(Value as string, 'MM/dd/yyyy');
            if(tempDate < tempIpDate){
              errorMessage.errorMessage.push(data.ErrorMessage);
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = true;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: true
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
            else{
              if(this.overallFieldErrorList && this.overallFieldErrorList.length > 0){
                this.overallFieldErrorList.map((err: {id: string; error: boolean; }) => {
                  if(id == err.id){
                    err.error = false;
                  }
                })
              }
              else{
                let overallFieldErrorObj: {id: string; error: boolean; } = {
                  id: id,
                  error: false
                };
                this.overallFieldErrorList.push(overallFieldErrorObj);
              }
            }
          }
        }
      });
    }
    this.overallFieldError = this.overallFieldErrorList.some(item => item.error);
    let page = this.getJSONValueBasedOnFieldID('28');
    if(this.PageType === 'Record Split' && (this.TorId == undefined || this.TorId == null || this.TorId == '') && (page == undefined || page == null || page == '')){
      this.overallFieldError = true;
    }
    return errorMessage;
  }

  /*
      *** Set Date after date pipe convert ***
  */
  onChangeDate(e: any, value: string): string {
    if(e && moment(e).isValid()){
      return value = this.datePipe.transform( new Date(e), 'MM/dd/yyyy')
    }
    else{
      return e;
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
  async getIntelliSearchData(Url: string, apiInput: customDictionary, Value: string | boolean | number): Promise<string[]> {
    const requestUrl: string = `${environment.apiService}${Url}`;
    const params: customDictionary = apiInput;
    let output: string[] = [];
    
    try {
      const response = await lastValueFrom(this.http.post(requestUrl, params)) as string[];
      if (response && response.length) {
        output = this.customSort(response);
          }
    } catch (error) {
      }
  
    return output;
  }
  customSort(arr) {
    // Sort the array
    arr.sort((a, b) => {
        // Extract the first character of each string
        const firstCharA = a.charAt(0);
        const firstCharB = b.charAt(0);

        // Check the type of the first character
        const typeA = this.getType(firstCharA);
        const typeB = this.getType(firstCharB);

        // Compare the types
        if (typeA === typeB) {
            // If both first characters are of the same type, perform a standard string comparison
            return a.localeCompare(b);
        } else {
            // If types are different, prioritize alphabet > number > special character
            return typeA - typeB;
        }
    });

    return arr;
  }

  // Function to determine the type of the character
  getType(char) {
      if (/[a-zA-Z]/.test(char)) {
          return 1; // Alphabet
      } else if (/\d/.test(char)) {
          return 2; // Number
      } else {
          return 3; // Special character
      }
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
  getMaxDate(ValidationData: ValidationData[], FieldID: string): Date{
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
    else if(FieldID == '20'){
      const customPipe = new DateConvertPipe();
      let tempDate: Date | string = customPipe.transform(new Date(), 'MM/dd/yyyy');
      date = tempDate as Date;
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
      Data: [],
      Type: 'Page Bunching'
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
      if(this.SlideToggle) {
        this.bunchingStartPageNumbers = element.Value
      }
    });
    this.CustomEventEmitter.emit(Output);
    console.log(this.SlideToggle);   
    if(this.SlideToggle) {
      this.btnDisableBasedOnBunging = true;
      this.sessionStorage.setItem('pageBunging', 'true');
    } else {
      this.btnDisableBasedOnBunging = false;
      this.sessionStorage.setItem('pageBunging', 'false');
      let pageValue = this.getJSONValueBasedOnFieldName("Page Numbers")
      let tempValue = this.removeSpecialCharacters(pageValue);
      this.modifyJSONBasedOnFieldName(tempValue, "Page Numbers")
    }
  }

  /*
      *** Button EventEmitter ***
  */
  buttonTrigger(CurrentInput: InputObj): void{
    this.loaderService.showLoader();
    let Output: CustomOutput = {
      CustomEvent: "Button",
      Value: CurrentInput.Label === 'Verify' ? this.getJSONValueBasedOnFieldName("VAERS ID") : '',
      Data: [],
      Type: CurrentInput.Label
    };
      Output.Data.push({
      Type: CurrentInput.Type,
      FieldType: CurrentInput.FieldType,
      Label: CurrentInput.Label,
      Value: CurrentInput.Value,
      TempValue: CurrentInput.TempValue,
      id: CurrentInput.id,
      Level: CurrentInput.Level,
      index: CurrentInput.index,
      IntelliSearchData: CurrentInput.IntelliSearchData,
      ValidationData: CurrentInput.ValidationData,
      AdditionalData: CurrentInput.AdditionalData,
      Attributes: CurrentInput.Attributes,
        CompleteJson: this.inputJson,
      ConfidenceType: CurrentInput.ConfidenceType,
      Dimensions: CurrentInput.Dimensions
      });
    let errorData: { errorMessage: string[]; id: string; } = this.getErrorMessage(CurrentInput.Type, CurrentInput.FieldType, CurrentInput.Value, CurrentInput.Label, CurrentInput.id, CurrentInput.Level, CurrentInput.index, CurrentInput.IntelliSearchData, CurrentInput.ValidationData, CurrentInput.Attributes, CurrentInput.AdditionalData , CurrentInput.TempValue);
    if(errorData.id === CurrentInput.id && errorData.errorMessage.length === 0){
    this.CustomEventEmitter.emit(Output);
      if(CurrentInput.Label === 'Search'){
        let InputObj = {
          "FirstName": this.getJSONValueBasedOnFieldName("First Name"),
          "LastName": this.getJSONValueBasedOnFieldName("Last Name"),
          "DOB": this.getJSONValueBasedOnFieldName("DOB"),
          "Age": this.getJSONValueBasedOnFieldName("Age"),
          "Gender": this.getJSONValueBasedOnFieldName("Gender")
        }
        const insertValueMainLoop = (node, fieldType, value) => {
          node.forEach(child => insertValue(child, fieldType, value))
          return node
        }
        
        const insertValue = (node, fieldType, value) => {
          const stack = []
          let i
          stack.push(node);
        
          while (stack.length > 0) {
            node = stack.pop();
            if (node.FieldType === fieldType) {
              node.GridAPIInput.FirstName = value.FirstName;
              node.GridAPIInput.LastName = value.LastName;
              node.GridAPIInput.DOB = value.DOB;
              node.GridAPIInput.Age = value.Age;
              node.GridAPIInput.Gender = value.Gender;
              this.refreshGrid = false;
              return node;
            } else if (node.Child?.length) {
              for (i = 0; i < node.Child.length; i++) {
                stack.push(node.Child[i]);
              }
            }
          }
          return null;
        }
        if(!this.areAllKeysEmpty(InputObj)){
          this.inputJson = insertValueMainLoop(this.inputJson, "Grid", InputObj);
          setTimeout(() => {
            this.loaderService.hideLoader();
            this.refreshGrid = true;
          }, 200);
        }
        else{
          this.loaderService.hideLoader();
          console.log("error")
        }
      }
    }
  }

  areAllKeysEmpty(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== '' && !this.isEmptyObject(value)) {
          return false;
        }
      }
    }
    return true;
  }

  isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  
  /*
      *** focus Field By ID ***
  */
  focusFieldByID(ID: string): void {
    if (this.Fields && this.Fields.length) {
      const inputElement = this.Fields.find(el => el.nativeElement.id === ID);
      if (inputElement) {
        inputElement.nativeElement.focus();
      }
    }
  }

  /*
      *** focus first Field ***
  */
  ngAfterViewInit() {
    this.SlideToggle = false;
    if (this.Fields && this.Fields.first) {
      this.Fields.first.nativeElement.focus();
      this.panelOpen = true;
      setTimeout(() => {
        this.panelOpen = false;
      }, 700);
    }
  }
  /*
      ***Close mat auto complete on container close ***
  */
  onContainerScroll(scrollOffset): void{
    // if (scrollOffset) { // Adjust the threshold value as needed
      this.autocompleteTriggers.forEach(trigger => {
        if (trigger.panelOpen) {
          trigger.closePanel();
        }
      });
    // }
  }

  /*
      ***To Load Dyanamic Grid data ***
  */
      gridApiData(GridAPIInput: customDictionary, Endpoint: string, id: string): EcareGridSettings{
        let GridSettings: EcareGridSettings = {
          id: id,
          checklocaljson : false,
          rowSelection: 'single',
          gridname: 'CaseDetail ' + id,
          apiRequest: GridAPIInput,
          apiMethod: 'post',
          apiUrl: `${environment.apiService}${Endpoint}`,
          gridHeight: 'auto'
        }
        return GridSettings;
      }

  /**********Save Page Level Json***********/
  savePageJson(from: string) {
    this.loaderService.showLoader();
    this.typeOfRecord = '';
    const insertValueMainLoop = (node, id, value) => {
      node.forEach(child => insertValue(child, id, value))
      return node
    }
    
    const insertValue = (node, id, value) => {
      const stack = []
      let i
      stack.push(node);
    
      while (stack.length > 0) {
        node = stack.pop();
        if (node.id === id) {
          // node.originalValue = value;
          return node;
        } else if (node.Child?.length) {
          for (i = 0; i < node.Child.length; i++) {
            stack.push(node.Child[i]);
          }
        }

        if (node.FieldId === '26' && node.Label === 'Type of Record') {
          this.typeOfRecord = node.Value;
        }
        if(node.FieldId === '28' && node.Label === 'Page Numbers') {
          this.pageNumbers = node.Value;
        }
      }
      return null;
    }
    this.idValueArray.map(item=>{
      this.inputJson = insertValueMainLoop(this.inputJson, item.id, item.originalValue);
    })

    if(this.typeOfRecord == '') {
    }
    let obj = {
      Typeofservice: '',
      DOS: '',
      torId: ''
    }
    let index: number = this.RecordNo - 1;
    if(this.processingCardDetails) {
      obj = this.processingCardDetails[index];
    }

    let pageList: number;
    if(this.bunchingStartPageNumbers && this.bunchingStartPageNumbers != '') {
      // const tempPageno = this.bunchingStartPageNumbers.split(',');
      const tempPageno = this.getPageNumbers(this.bunchingStartPageNumbers);
      this.pageNumbers = tempPageno[0];
      pageList = tempPageno[tempPageno.length -1];
    } else {
      // const tempPageno = this.pageNumbers.split(',');
      if(this.pageNumbers && this.pageNumbers != ''){
        const tempPageno = this.getPageNumbers(this.pageNumbers);
        this.pageNumbers = tempPageno[0];
        pageList = tempPageno[tempPageno.length -1];
      }
    }
    let pageValue = this.getJSONValueBasedOnFieldID("28");
    if(pageList){
      let tempValue = this.removeSpecialCharacters(pageValue);
      this.modifyJSONBasedOnFieldName(tempValue, "Page Numbers")
      // console.log(JSON.stringify(this.inputJson))
    }
    else{
      this.loaderService.hideLoader();
    }
    let output: bulkSaveOutput = {
      Type: from,
      TOR: this.getJSONValueBasedOnFieldID("26"),
      DOS: this.getJSONValueBasedOnFieldID("27"),
      PageNumbers: this.getJSONValueBasedOnFieldID("28"),
      CompleteJson: this.inputJson,
      Page: this.pageNumbers,
      lastPage: pageList,
      torId: this.TorId
    }
    let page = this.getJSONValueBasedOnFieldID('28');
    if(this.TorId != undefined && this.TorId != null && this.TorId != '' && (page == undefined || page == null || page == '')){
      const dialogRef = this.dialog.open(PopupTemplateComponent, {
        width: '500px',
        data: <IDynamicDialogConfig>{
          title: 'Alert',
          titleFontSize:'20',
          dialogContent: 'Splits with no pages will be deleted. Would you like to continue.',
          dialogContentFontSize: '15',
          acceptButtonTitle: 'Okay',
          declineButtonTitle: 'Cancel',
          titlePosition: 'left',
          contentPosition : 'left',
          buttonPosition : 'right',
          showClose : false,
          showDeclineButton: true
        }
      });
      dialogRef.disableClose = true;
  
      dialogRef.componentInstance.buttonClicked.subscribe(action => {
        switch (action) {
          case 'accept':
            this.bulkSaveEventEmitter.emit(output);
            break;
          case 'decline':
  
            break;
        }
      });
    }
    else{
      this.bulkSaveEventEmitter.emit(output);
    }
  }

 /**********Set Original Value***********/  
  setOldValue() {
    this.idValueArray = [];
    const bunching = (item) => {
      if (item.Child && item.Child.length > 0) {
        item.Child.forEach(bunching)
      }
      if (item.Label) {
        const Obj = {
          id: item.id,
          originalValue: item.Value ? item.Value : ''
        }
        this.idValueArray.push(Obj);
      }
    }
    this.inputJson.forEach((element) => {
      bunching(element);
    });
  }

  /**********Complete Manage list***********/  
  completeManageList() {
      let reqObj = {
        Caseid: this.taskDetails['Case ID'].toString(),
        CaseStatus: "Completed",
        CaseBusinessStatus: "Completed"
      }
    this.sharedService.updateCaseStatus(reqObj).subscribe({
      next:  (response) => {},
      error:  (error) => {
      },
      complete:()=>{}})
  }

  /**** Restrict Keys ****/
  restrictKey(event: KeyboardEvent, Type: string, FieldType: string, Value: string | boolean | number, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number) {
    if(ValidationData && ValidationData.length){
      ValidationData.map((data: any) => {
        if(data.RuleID === 2){
          if (FieldType === "Input" || FieldType === "Textarea") {
            const regExp = new RegExp(data.ValidationInput)
            if(!regExp.test(event.key)){
              event.preventDefault();
            }
          }
        }
      });
    }
  }
  
  /*
      *** Modify JSON Based On ID ***
  */
      modifyJSONBasedOnID(inputValue, inputID): void{
        const insertValueMainLoop = (node, id, value) => {
          node.forEach(child => insertValue(child, id, value))
          return node
        }
        
        const insertValue = (node, id, value) => {
          const stack = []
          let i
          stack.push(node);
        
          while (stack.length > 0) {
            node = stack.pop();
            if (node.id === id) {
              node.Value = value;
              return node;
            } else if (node.Child?.length) {
              for (i = 0; i < node.Child.length; i++) {
                stack.push(node.Child[i]);
              }
            }
          }
          return null;
        }
        
        this.inputJson = insertValueMainLoop(this.inputJson, inputID, inputValue);
      }
      /*
          *** Modify JSON Based On FieldName ***
      */
      modifyJSONBasedOnFieldName(inputValue, inputFieldName): void{
        const insertValueMainLoop = (node, fieldName, value) => {
          node.forEach(child => insertValue(child, fieldName, value))
          return node
        }
        
        const insertValue = (node, fieldName, value) => {
          const stack = []
          let i
          stack.push(node);
        
          while (stack.length > 0) {
            node = stack.pop();
            if (node.Label === fieldName) {
              node.Value = value;
              return node;
            } else if (node.Child?.length) {
              for (i = 0; i < node.Child.length; i++) {
                stack.push(node.Child[i]);
              }
            }
          }
          return null;
        }
        
        this.inputJson = insertValueMainLoop(this.inputJson, inputFieldName, inputValue);
      }
      /*
          *** Modify JSON Based On FieldId ***
      */
      modifyJSONBasedOnFieldId(inputValue, inputFieldId): void{
        const insertValueMainLoop = (node, fieldId, value) => {
          node.forEach(child => insertValue(child, fieldId, value))
          return node
        }
        
        const insertValue = (node, fieldId, value) => {
          const stack = []
          let i
          stack.push(node);
        
          while (stack.length > 0) {
            node = stack.pop();
            if (node.FieldId === fieldId) {
              node.Value = value;
              return node;
            } else if (node.Child?.length) {
              for (i = 0; i < node.Child.length; i++) {
                stack.push(node.Child[i]);
              }
            }
          }
          return null;
        }
        
        this.inputJson = insertValueMainLoop(this.inputJson, inputFieldId, inputValue);
      }
      /*
          *** Get JSON Value On FieldName ***
      */
      getJSONValueBasedOnFieldName(inputFieldName: string): string {
        let response: string;
        const getValueFromMainLoop = (node: InputObj[], fieldName: string) => {
          node.forEach(child => getValueFromChildLoop(child.Child, fieldName));
        }
        const getValueFromChildLoop = (node: InputObj[], fieldName: string) => {
          node.forEach(child => {
            if (child.Label && child.Label === fieldName) {
              response = child.Value as string;
            }
            else if (child.Child && child.Child.length > 0) {
              getValueFromChildLoop(child.Child, fieldName);
            }
          });
        }
        getValueFromMainLoop(this.inputJson, inputFieldName);
        return response;
      }
      
      /*
          *** Get JSON Value On FieldID ***
      */
          getJSONValueBasedOnFieldID(inputFieldId: string): string {
            let response: string;
            const getValueFromMainLoop = (node: InputObj[], fieldId: string) => {
              node.forEach(child => getValueFromChildLoop(child.Child, fieldId));
            }
            const getValueFromChildLoop = (node: InputObj[], fieldId: string) => {
              node.forEach(child => {
                if (child.FieldId && child.FieldId === fieldId) {
                  response = child.Value as string;
                }
                else if (child.Child && child.Child.length > 0) {
                  getValueFromChildLoop(child.Child, fieldId);
                }
              });
            }
            getValueFromMainLoop(this.inputJson, inputFieldId);
            return response;
          }
  /*
      *** Paste restict on input event ***
  */
  onPaste(event: ClipboardEvent, Type: string, FieldType: string, Value: string | boolean | number, Label: string, id: string, Level: number, index: number, IntelliSearchData: IntelliSearchData[], ValidationData: ValidationData[], Attributes: Attributes[], AdditionalData: AdditionalData[], TempValue: string | boolean | number) {
    if(ValidationData && ValidationData.length){
      ValidationData.map((data: any) => {
        if(data.RuleID === 2){
          if (FieldType === "Input" || FieldType === "Textarea") {
            const regExp = new RegExp(data.ValidationInput)
            if(!regExp.test(event.clipboardData.getData('text'))){
              event.preventDefault();
            }
          }
        }
      });
    }
  }
  /*
      *** Complete Page Event ***
  */
  CompletePage() {
    if(this.PageType === 'Establish Case'){
      const dialogRef = this.dialog.open(PopupTemplateComponent, {
        width: '500px',
        data: <IDynamicDialogConfig>{
          title: 'Alert',
          titleFontSize:'20',
          dialogContent: 'The Document will be linked with the selected VAERS ID and this action can not be reversed. Are you sure?',
          dialogContentFontSize: '15',
          acceptButtonTitle: 'Okay',
          declineButtonTitle: 'Cancel',
          titlePosition: 'left',
          contentPosition : 'left',
          buttonPosition : 'right',
          showClose : false,
          showDeclineButton: true
        }
      });
      dialogRef.disableClose = true;
  
      dialogRef.componentInstance.buttonClicked.subscribe(action => {
        switch (action) {
          case 'accept':
            this.loaderService.showLoader();
              this.closeCompleteEventEmitter.emit("Complete");
            break;
          case 'decline':
  
            break;
        }
      });
    }
    else{
      let value = this.getJSONValueBasedOnFieldName("Type of Record")
      if(value && value != ''){
        this.loaderService.showLoader();
        this.savePageJson("Complete");
      }
      else{
        let reqObj = {
          CaseId: this.taskDetails['Case_ID']
        }
        let untagged: boolean = true;
        this.sharedService.GetCaseUntaggedPages(reqObj).subscribe({
        next:  (response) => {
          if(response?.length == 0){
            untagged = false
          }
          else{
            untagged = true
          }
        },
        error:  (error) => {},
        complete:()=>{
          const dialogRef = this.dialog.open(PopupTemplateComponent, {
            width: '500px',
            data: <IDynamicDialogConfig>{
              title: 'Alert',
              titleFontSize:'20',
              dialogContent: untagged ? 'There are untagged Pages in the Document. Would you like to continue.' : 'Are you sure to complete Record Split?',
              dialogContentFontSize: '15',
              acceptButtonTitle: 'Okay',
              declineButtonTitle: 'Cancel',
              titlePosition: 'left',
              contentPosition : 'left',
              buttonPosition : 'right',
              showClose : false,
              showDeclineButton: true
            }
          });
          dialogRef.disableClose = true;
      
          dialogRef.componentInstance.buttonClicked.subscribe(action => {
            switch (action) {
              case 'accept':
                this.loaderService.showLoader();
                  this.closeCompleteEventEmitter.emit("Complete");
                break;
              case 'decline':
      
                break;
            }
          });
        }})
      }
    }
  }
  /*
      *** Close Page Event ***
  */
  ClosePage() {
    const dialogRef = this.dialog.open(PopupTemplateComponent, {
      width: '500px',
      data: <IDynamicDialogConfig>{
        title: 'Alert',
        titleFontSize:'20',
        dialogContent: 'You are about to leave this page. Any unsaved changes will be lost.',
        dialogContentFontSize: '15',
        acceptButtonTitle: 'Okay',
        declineButtonTitle: 'Cancel',
        titlePosition: 'left',
        contentPosition : 'left',
        buttonPosition : 'right',
        showClose : false,
        showDeclineButton: true
      }
    });
    dialogRef.disableClose = true;

    dialogRef.componentInstance.buttonClicked.subscribe(action => {
      switch (action) {
        case 'accept':
          this.loaderService.showLoader();
          this.closeCompleteEventEmitter.emit("Close");
          break;
        case 'decline':

          break;
      }
    });
  }
  /*
      *** Close Page Event ***
  */
  ConfirmVAERSID() {
    this.loaderService.showLoader();
    this.sessionStorage.setItem('lsLoaded', 'N');
    let output: CustomGenericEvent = {
      Type: 'ConfirmVaersId',
      Data: this.selectedRowDetails
    }
    this.CustomGenericEventEmitter.emit(output);
  }
  /*
      *** Close Page Event ***
  */
  CancelLookUp() {
    this.closeCompleteEventEmitter.emit("Complete");
  }
  
  handleCheckBoxEvent(event){
    // if (event['selectedRowCount'] == 1) {
    //     this.caseSelected = true;
    //     this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(event.selectedRowDetails))
    // } else {
    //     this.caseSelected = false;
    // }
    if (event['selectedRowCount'] == 1) {
        this.caseSelected = true;
        this.selectedRowDetails = event.selectedRowDetails;
    } 
    else {
        this.caseSelected = false;
    }
  }
  getPageNumbers(pageRange: string): number[] {
    const result: number[] = [];

    if(pageRange){
      // Split the input string by comma to get individual ranges or single page numbers
      const ranges = pageRange.split(',');
  
      // Iterate over each range
      ranges.forEach(range => {
          // Split each range by hyphen to get the start and end page numbers (if applicable)
          const [start, end] = range.split('-').map(Number);
  
          // If end is undefined, it means there's only one page number in the range
          if (end === undefined) {
              result.push(start);
          } else {
              // If both start and end are defined, add all page numbers in the range to the result array
              for (let i = start; i <= end; i++) {
                  result.push(i);
              }
          }
      });
    }

    return result;
  }

  getPlaceholderText(PlaceHolder, PageFieldType, Editable){
    return (PageFieldType === 'readonly' || Editable === 'readable' || Editable === 'disable') ? '' : PlaceHolder;
  }
  getFieldId23ErrorStatus(): boolean{
    let InputObj = {
      "FirstName": this.getJSONValueBasedOnFieldName("First Name"),
      "LastName": this.getJSONValueBasedOnFieldName("Last Name"),
      "DOB": this.getJSONValueBasedOnFieldName("DOB"),
      "Age": this.getJSONValueBasedOnFieldName("Age"),
      "Gender": this.getJSONValueBasedOnFieldName("Gender")
    }
    if(this.areAllKeysEmpty(InputObj)){
      return true;
    }
    else{
      return false;
    }
  }
  InvertedDatepickerClearEvent(FieldId: string): void{
    this.modifyJSONBasedOnFieldId('', FieldId);
  }

}
