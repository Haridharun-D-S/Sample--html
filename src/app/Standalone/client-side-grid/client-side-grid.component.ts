import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { GridOptions,IDateFilterParams,ModuleRegistry,SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  createGrid,
  ClientSideRowModelModule,
  RowClassRules,
  ToolPanelVisibleChangedEvent,
  GetContextMenuItems,
  ExcelStyle,
  ICellRendererParams,
  PaginationChangedEvent,
  RowNode
 } from 'ag-grid-community';
 import { RichSelectModule,ColumnsToolPanelModule,FiltersToolPanelModule, ITextFilterParams } from "ag-grid-enterprise";
import { MultiFilterModule } from "@ag-grid-enterprise/multi-filter";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { AgGridAngular } from 'ag-grid-angular';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import { GridService } from 'src/app/shared/services/grid.service';
import { CustomLoadingOverlayComponent } from '../custom-loading-overlay/custom-loading-overlay.component';
import { HyperlinkRendererComponent } from '../hyperlink-renderer/hyperlink-renderer.component';
import { ActionRendererComponent } from '../action-renderer/action-renderer.component';
import {  StatusRendererComponent } from '../status-renderer/status-renderer.component';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { CommonLoaderService } from '../common-loader/common-loader.service';
import { DynamicIconRendererComponent } from '../dynamic-icon-renderer/dynamic-icon-renderer.component';
import { SelectRendererComponent } from '../select-renderer/select-renderer.component';
import { CommonModule } from '@angular/common';
import { ButtonRendererComponent } from '../button-renderer/button-renderer.component';
import { HttpClient } from '@angular/common/http';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
ModuleRegistry.registerModules([
  MultiFilterModule,
  SetFilterModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule
]);
@Component({
  selector: 'app-client-side-grid',
  standalone: true,
  imports: [AgGridAngular,CustomLoadingOverlayComponent,HyperlinkRendererComponent,ActionRendererComponent,StatusRendererComponent, DynamicIconRendererComponent, SelectRendererComponent, CommonModule, ButtonRendererComponent],
  templateUrl: './client-side-grid.component.html',
  styleUrls: ['./client-side-grid.component.scss']
})
export class ClientSideGridComponent implements OnInit {
 @Input('gridSettings') gridSettings: EcareGridSettings;
 @Output() gridCheckBoxEvent = new EventEmitter<any>();
 @Output() gridClickEvent = new EventEmitter<any>();
 @Output() gridRowClickEvent = new EventEmitter<any>(); 
 @Output() gridDataEvent = new EventEmitter<any>();
 @Output() cellDropDownEmit = new EventEmitter<any>();columnData
 @Output() columnDataFilter = new EventEmitter<any>();
 @Output() filterModelData = new EventEmitter<any>(); 
 @Output() selectAllEvent = new EventEmitter<any>();
  gridOptions: GridOptions;
  LastApprovedTorId: string;
  selectedCheckBoxArray = [];
  private gridApi;
  private filterSubject = new Subject<any>();
  private previousFilterModel: any = null;
  private debounceTimeout: any; 
  private gridColumnApi;
  public rowData;
  gridResponseData: any;
  chckBxRowIndx: any;
  private columnDataTypeMap: object = {
    nvarchar: 'stringColumn',
    varchar: 'stringColumn',
    int: 'numberColumn',
    date: 'dateColumn',
    Date: 'dateColumn',
    datetime: 'dateColumn',
    list: 'multiColumn',
    boolean: 'noFilter'
  };
  columnFilterTypes = {
    numberColumn: {
      filter: 'agNumberColumnFilter'
    },
    dateColumn: {
      filter: 'agDateColumnFilter'
    },
    stringColumn: {
      filter: 'agTextColumnFilter'
    },
    multiColumn: {
      filter: 'agMultiColumnFilter'
    },
    noFilter: {
      filter: null
    }
  };
  textFilterParams = {
    filterOptions: ['Contains', 'NotContains', 'Equals', 'NotEqual', 'Between', 'StartsWith', 'EndsWith','Greaterthan', 'Lessthan', 'Greaterthanorequal','Lessthanorequal','blank', 'NotBlank' ],
    trimInput: true,
  }
  filterIntegerParamDefault = {
    suppressAndOrCondition: true,
    // filterOptions: [ 'Equals', 'NotEqual', 'Greaterthan', 'Lessthan', 'Greaterthanorequal','Lessthanorequal','blank', 'NotBlank' ]
  }
   filterTextParamDefault = {
    suppressAndOrCondition: true,
    // filterOptions: ['Contains', 'NotContains', 'Equals', 'NotEqual', 'StartsWith', 'EndsWith','blank', 'NotBlank' ]
  }
  selectedRowIds: Set<string> = new Set();
  filterParams: IDateFilterParams = {
    filterOptions: ['equals'],
    suppressAndOrCondition: false,
    filterPlaceholder: '',
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
      if (!cellValue) return -1;

      const dateParts = cellValue.split("/");
      if (dateParts.length !== 3) return -1;

      const month = parseInt(dateParts[0], 10);
      const day = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);

      if (isNaN(month) || isNaN(day) || isNaN(year)) return -1;

      const cellDate = new Date(year, month - 1, day);

      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
    inRangeFloatingFilterDateFormat: "MM/dd/yyyy",
    // filterPlaceholder: 'mm/dd/yyyy'
  };

  // enables pagination in the grid
  pagination = true;

  // sets 10 rows per page (default is 100)
  paginationPageSize = 10;

  // allows the user to select the page size from a predefined list of page sizes
  paginationPageSizeSelector = [10, 20, 50, 100];
  // [statusBar]="statusBar"
  statusBar = {
    statusPanels: [
        { statusPanel: 'agTotalAndFilteredRowCountComponent' },
        { statusPanel: 'agTotalRowCountComponent' },
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' }
    ]
};

overlayNoRowsTemplate = '<span aria-live="polite" aria-atomic="true" style="padding: 10px; border: 1px solid #e0e0e0; background: #fff; border-radius: 5px;"> No rows to \'display\' </span>';



 // Excel export options
  excelStyles: ExcelStyle[]  =  [
  // Style for header cells
  {
    id: 'header',
    // interior: {
    //   // Define header cell styles here
    //   color : '#ffffff',
    //   pattern: "Solid"
    //   // patternColor: undefined,
    // },
    font : {
      size: 14,
      bold: true,
      fontName : 'Calibri',
      color: '#065492'
    }
  },
  // Style for data cells
  {
    id: 'cell',
    font : {
      size: 12, // Font size
      color: '#000000',
      fontName : 'Calibri'
    }
  }
]

public loadingOverlayComponent: any = CustomLoadingOverlayComponent;
  public loadingOverlayComponentParams: any = {
    loadingMessage: "One moment please...",
  };
  previousFocusedCell: any;
  PreviousRowIndex: number;
  currentRowIndex: number;
  TotalRenderedRowIndex: any;
  recordListingPageType: string;
  customTableHeight: string = '520px';
  autoHeight: boolean = false;
  rowcount: any;
  selectAllEnabled: boolean;
  partiallySelected: boolean = false;
  filterApplied: boolean;
  selectedRowCount: number = 0;
  totalRowCount: number = 0;
  // Add new property to track if all data is selected
  isAllDataSelected: boolean = false;
  selectedTempCheckBoxArray = [];
  constructor(
    private gridService: GridService,
    private sessionStorage: SessionStorageService,
    private loaderService: CommonLoaderService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.recordListingPageType = this.sessionStorage.getItem('recordListingPageType')
    this.setGridOptions();
  }

  setGridOptions() {
    this.gridOptions = <GridOptions> {
      icons: {
        filter: '<img src="assets/Images/filter.png" width="13px" height="13px">'
      },
      rowModelType: 'infinite', // Use infinite row model
      cacheBlockSize: 10, // Number of rows per block/page
      maxBlocksInCache: 1, // Maximum number of pages in memory
      pagination: true,
      paginationPageSize: 10, // Page size for pagination
      defaultColDef: {
        resizable: true,
        editable: true,
        filter: true,
        sortable: true,
        wrapHeaderText: true,
        floatingFilter: true
      },
      enableBrowserTooltips: true,
      rowSelection: this.gridSettings.rowSelection === 'single' ? 'single' : 'multiple',
      // rowSelection : 'single',
      rowDeselection: true,
      suppressRowClickSelection: true,
      sideBar: !this.gridSettings.gridname.includes('CaseDetail') && this.gridSettings.gridname !== 'SetPriorityGrid' && this.gridSettings.gridname !== 'AssignReAssignGrid' && this.gridSettings.gridname !== 'AssignReAssignTaskGrid' && this.gridSettings.gridname !== 'RecordListingGrid'  && this.gridSettings.gridname !== 'reportsGrid' ?  {
        toolPanels: [
          // {
          //   id: 'columns',
          //   labelDefault: 'Columns',
          //   labelKey: 'columns',
          //   iconKey: 'columns',
          //   toolPanel: 'agColumnsToolPanel',
          //   minWidth: 225,
          //   width: 225,
          //   maxWidth: 225,
          //   toolPanelParams: {
          //     suppressPivots: true,
          //     suppressPivotMode: true,
          //     suppressRowGroups: true,
          //     suppressValues: true
          //   }
          // },
          {
            id: 'filter',
            labelDefault: 'Filter',
            labelKey: 'filter',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            minWidth: 0.5,
            width: 0.5,
            maxWidth: 0.5,
          }
        ],
        defaultToolPanel: "filters",
      } : {},
      suppressFieldDotNotation: true,
      onGridSizeChanged: (params) => {
          params.api.sizeColumnsToFit();
      },
      onCellMouseOver: (params) => {
        const colDef = this.gridApi.getColumnDef(params.column.getColId());
        const columnName = colDef.field;
        const focusedCell = this.gridApi.getFocusedCell();
        if(focusedCell){
          if(focusedCell.rowIndex == params.rowIndex){
            if(columnName == 'Edit'){
              this.gridApi.setFocusedCell(focusedCell.rowIndex, 'Edit');
            }
            if(columnName == 'Page No'){
              this.gridApi.setFocusedCell(focusedCell.rowIndex, 'Page No');
            }
          }
        }
      },
      onRowSelected: (params) => {
        if(this.gridApi && this.gridApi.getRenderedNodes()){
          const displayedNodes = this.gridApi.getRenderedNodes();
          const selectedCount = displayedNodes.filter(node => node.isSelected()).length;
          const totalNodes = displayedNodes.length;
          
          // Update selection states and counts
          this.selectedRowCount = selectedCount;
          this.totalRowCount = this.gridApi.getDisplayedRowCount();
          
          if (selectedCount === 0) {
            // this.selectAllEnabled = false;
            this.partiallySelected = false;
          } else if (selectedCount === totalNodes) {
            // this.selectAllEnabled = true;
            this.partiallySelected = false;
          } else {
            // this.selectAllEnabled = false;
            this.partiallySelected = true;
          }
        }
        let selected = params.node.isSelected()
        let selectedRowDetails = params.data;
        selectedRowDetails.GridName = this.gridSettings.gridname;
        selectedRowDetails.rowIndex = params.rowIndex;
        selectedRowDetails.checkboxSelected = selected;

        if(this.gridSettings.rowSelection == 'single') {
          if(selected){
            this.chckBxRowIndx = params.rowIndex
            // let gridCheckBoxDetail = {
            //   selectedRowCount: 1,
            //   selectedRowDetails: selectedRowDetails,
            //   selectedData: params.data
            // };
            this.selectedCheckBoxArray = [];
            this.selectedTempCheckBoxArray = [];
            this.selectedCheckBoxArray.push(selectedRowDetails)
            this.selectedTempCheckBoxArray.push(selectedRowDetails)
            let gridCheckBoxDetail = {
              selectedRowCount: this.selectedCheckBoxArray.length,
              selectedRowDetails: this.selectedCheckBoxArray,
              selectedTempRowDetails: this.selectedTempCheckBoxArray,
              selectedData: params.data
            };
            this.gridCheckBoxEvent.emit(gridCheckBoxDetail);
          } else {
            // if(this.chckBxRowIndx === params.rowIndex){
              // let gridCheckBoxDetail = {
              //   selectedRowCount: 0,
              //   selectedRowDetails: selectedRowDetails,
              //   selectedData: params.data
              // };
              this.selectedTempCheckBoxArray.map((item,i)=>{
                if(item.rowIndex == params.rowIndex) {
                  this.selectedTempCheckBoxArray.splice(i,1);
                }
              })
              let gridCheckBoxDetail = {
                selectedRowCount: this.selectedCheckBoxArray.length,
                selectedRowDetails: this.selectedCheckBoxArray,
                selectedTempRowDetails: this.selectedTempCheckBoxArray,
                selectedData: params.data
              };
              this.gridCheckBoxEvent.emit(gridCheckBoxDetail);
            // }
          }
       } else { 
        if(selected){
          this.chckBxRowIndx = params.rowIndex
          this.selectedCheckBoxArray.push(selectedRowDetails)
          this.selectedTempCheckBoxArray.push(selectedRowDetails)
          let gridCheckBoxDetail = {
            selectedRowCount: this.selectedCheckBoxArray.length,
            selectedRowDetails: this.selectedCheckBoxArray,
            selectedTempRowDetails: this.selectedTempCheckBoxArray,
            selectedData: params.data
          };
          this.gridCheckBoxEvent.emit(gridCheckBoxDetail);
        } else {
          // if(this.chckBxRowIndx === params.rowIndex){
            this.selectedTempCheckBoxArray.map((item,i)=>{
              if(item.rowIndex == params.rowIndex) {
                this.selectedTempCheckBoxArray.splice(i,1);
              }
            })
            let gridCheckBoxDetail = {
              selectedRowCount: this.selectedCheckBoxArray.length,
              selectedRowDetails: this.selectedCheckBoxArray,
              selectedTempRowDetails: this.selectedTempCheckBoxArray,
              selectedData: params.data
            };
            this.gridCheckBoxEvent.emit(gridCheckBoxDetail);
          // }
        }
       }
      },
      getRowClass: (params: any) => {
        // return this.selectAllEnabled ? 'disabled-checkbox-row' : '';
        return this.selectAllEnabled ? '' : '';
      },
      onCellClicked: (params) => {
        const allRowData = [];
        this.gridApi.forEachNode((node) => {
          allRowData.push(node.data);
        });
        let output = {
          From: '',
          Data: params.data,
          AllData: allRowData,
          Type: 'Click'
        }
        this.gridRowClickEvent.emit(output);
      },
      onCellFocused: (params) => {
          // console.log(params);
        let rowData = this.gridApi.getRenderedNodes().map(node => node.data);
        this.TotalRenderedRowIndex = rowData.length;
        this.currentRowIndex = params.rowIndex;
        const focusedCell = this.gridApi.getFocusedCell();
        const focusedRowData = this.gridApi.getRowNode(params.rowIndex).data;
        const focusedColDef = params.api.getColumnDef(focusedCell.column.getColId());
        const cellRendererName = focusedColDef.cellRenderer;
        const allRowData = [];
        params.api.forEachNode((node) => {
          allRowData.push(node.data);
        });
        let output = {
          From: cellRendererName,
          Data: focusedRowData,
          AllData: allRowData,
          rowIndex: params.rowIndex,
          Type: ''
        }
        this.gridRowClickEvent.emit(output);
        output.Type = 'Focus'
        if (this.previousFocusedCell && this.PreviousRowIndex !=  params.rowIndex) {
          // if(cellRendererName !== 'HyperlinkRendererComponent' && cellRendererName !== 'ActionRendererComponent'){
            this.previousFocusedCell.Type = 'FocusOut'
            // this.gridClickEvent.emit(this.previousFocusedCell);
            if(this.gridSettings.gridname === 'RecordListingGrid' && this.recordListingPageType == 'editable'){
              if(this.previousFocusedCell.Data.statusIcon == 'fa-solid fa-circle' && this.previousFocusedCell.Data.statusIconColour == '#fa9441'){
                this.previousFocusedCell.Data.statusIconColour = '#3cc47c';
                this.gridRowClickEvent.emit(this.previousFocusedCell);
                let rowNode = this.gridApi.getRowNode(this.previousFocusedCell.rowIndex);
                if (rowNode) {
                  rowNode.setData(this.previousFocusedCell.Data);
                  this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
                }
              } 
            // }
          }
        }
        if(this.PreviousRowIndex === null || this.PreviousRowIndex === undefined ){
          this.PreviousRowIndex = params.rowIndex;
          this.previousFocusedCell = output;
          // this.gridClickEvent.emit(output);
          if(this.gridSettings.gridname === 'RecordListingGrid' && this.recordListingPageType == 'editable'){
            if(focusedRowData.statusIcon == 'fa-regular fa-circle'){
              focusedRowData.statusIcon = 'fa-solid fa-circle';
              focusedRowData.statusIconColour = '#fa9441';
              this.gridRowClickEvent.emit(output);
              let rowNode = this.gridApi.getRowNode(params.rowIndex);
              if (rowNode) {
                rowNode.setData(focusedRowData);
                this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
              }
            }
          }
        }
        else if(this.PreviousRowIndex !=  params.rowIndex){
          this.PreviousRowIndex = params.rowIndex;
          this.previousFocusedCell = output;
          // this.gridClickEvent.emit(output);
          if(this.gridSettings.gridname === 'RecordListingGrid' && this.recordListingPageType == 'editable'){
            // let rowNode = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
            if(focusedRowData.statusIcon == 'fa-regular fa-circle'){
              focusedRowData.statusIcon = 'fa-solid fa-circle';
              focusedRowData.statusIconColour = '#fa9441';
              this.gridRowClickEvent.emit(output);
              let rowNode = this.gridApi.getRowNode(params.rowIndex);
              if (rowNode) {
                rowNode.setData(focusedRowData);
                this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
              }
            } 
          }
        }
      },
      onPaginationChanged: (params) => {
        if (this.isAllDataSelected) {
          // If all data is selected, select all rows on the new page
          const displayedNodes = this.gridApi.getRenderedNodes();
          displayedNodes.forEach(node => {
            node.setSelected(true);
          });
          // Maintain the counts
          this.selectedRowCount = this.totalRowCount;
        } else {
          // Reset selections if not all data selected
          this.selectedRowCount = 0;
          this.totalRowCount = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
          // this.selectAllEnabled = false;
          this.partiallySelected = false;
          this.selectedCheckBoxArray = [];
          
          if (this.gridApi) {
            this.gridApi.deselectAll();
            const displayedNodes = this.gridApi.getRenderedNodes();
            displayedNodes.forEach(node => {
              node.setSelected(false);
            });
          }

          let gridCheckBoxDetail = {
            selectedRowCount: 0,
            selectedRowDetails: []
          };
          // this.gridCheckBoxEvent.emit(gridCheckBoxDetail);
        }
      }
    }
  }


  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    let targetNode = event.relatedTarget as Node;
    let isClassPresent: boolean = true;
    if(targetNode == null){
      let targetNode2 = event.target as Node;
      if(targetNode2){
        let childNodesArray = Array.from(targetNode2.childNodes);
        // console.log(childNodesArray);
        for (let i = 0; i < childNodesArray.length; i++) {
          const childNode = childNodesArray[i];
          
          // Check if the child node is an element node
          if (childNode.nodeType === Node.ELEMENT_NODE) {
              // Cast the child node to HTMLElement to access classList property
              const childElement = childNode as HTMLElement;
              
              // Check if the child node has the desired class
              if (childElement.classList.contains("fa-thumbs-down")) {
                isClassPresent = false; // Class found
              }
          }
        }
      }
    }
    if(targetNode){
      let childNodesArray = Array.from(targetNode.childNodes);
      console.log(childNodesArray);
      for (let i = 0; i < childNodesArray.length; i++) {
        const childNode = childNodesArray[i];
        
        // Check if the child node is an element node
        if (childNode.nodeType === Node.ELEMENT_NODE) {
            // Cast the child node to HTMLElement to access classList property
            const childElement = childNode as HTMLElement;
            
            // Check if the child node has the desired class
            if (childElement.classList.contains("ag-cell-wrapper") || childElement.classList.contains("fa-thumbs-down")) {
              isClassPresent = false; // Class found
            }
        }
      }
    }
    // else{
    //   isClassPresent = false;
    // }
    if(isClassPresent){
      if(this.gridSettings.gridname === 'RecordListingGrid' && this.recordListingPageType == 'editable'){
        let data = this.previousFocusedCell.Data;
        if(data.statusIcon == 'fa-solid fa-circle' && data.statusIconColour == '#fa9441'){
          data.statusIconColour = '#3cc47c';
          this.previousFocusedCell.Type = 'FocusOut'
          this.gridRowClickEvent.emit(this.previousFocusedCell);
          let rowNode = this.gridApi.getRowNode(this.previousFocusedCell.rowIndex);
          if (rowNode) {
            rowNode.setData(data);
            this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
          }
        } 
      }
    }
  }
  updateRowData(rowIndex: number, newData: any) {
    // Get the row node corresponding to the rowIndex
    const rowNode = this.gridApi.getRowNode(rowIndex);

    if (rowNode) {
      // Update the data in the row node
      rowNode.setData(newData);

      // Refresh the grid to reflect the changes
      this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
    }
  }
  onFirstDataRendered(params) {
    if(this.gridSettings.gridname === 'RecordListingGrid'){
      if(this.LastApprovedTorId === null || this.LastApprovedTorId === undefined || this.LastApprovedTorId == ''){
        this.gridApi.setFocusedCell(0, 'Record Type');
      }
      else{
        let rowIndex = -1;
        this.gridApi.forEachNode((node, index) => {
            if (this.compareObjects(node.data['TOR Id'], this.LastApprovedTorId)) {
              rowIndex = index;
                return;
            }
        });
        if (rowIndex !== -1) {
          rowIndex =  rowIndex;
        } else {
          rowIndex = 0
        }
        this.gridApi.setFocusedCell(rowIndex, 'Record Type');
      }
    }
    let WrokQueue_From = this.sessionStorage.getItem('WrokQueue_From');
    let WrokQueue_Page_Loading = this.sessionStorage.getItem('WrokQueue_Page_Loading');
    if((WrokQueue_From == 'basepage' ||  WrokQueue_From == 'BtnAction') && WrokQueue_Page_Loading == 'Y'){
      let CasesDetails = JSON.parse(this.sessionStorage.getItem('selectedCasesDetails'));
      if(CasesDetails){
        let CaseDetails = CasesDetails[0];
        if(CaseDetails){
          if(CaseDetails.WorkQueueType == 'Case'){
            let rowIndex = -1;
            this.gridApi.forEachNode((node, index) => {
                if (this.compareObjects(node.data['Doc ID'], CaseDetails['Doc ID'])) {
                  rowIndex = index;
                    return;
                }
            });
            if (rowIndex !== -1) {
              rowIndex =  rowIndex;
            } else {
              rowIndex = 0
            }
            this.setDynamicFocus(rowIndex);
          }
          else{
            let rowIndex = -1;
            this.gridApi.forEachNode((node, index) => {
                if (this.compareObjects(node.data['Task ID'], CaseDetails['Task ID'])) {
                  rowIndex = index;
                    return;
                }
            });
            if (rowIndex !== -1) {
              rowIndex =  rowIndex;
            } else {
              rowIndex = 0
            }
            this.setDynamicFocus(rowIndex);
          }
        }
      }
    }
  }
  setDynamicFocus(rowIndex){
    const pageSize = this.gridApi.paginationGetPageSize();
    const pageIndex = Math.floor(rowIndex / pageSize);
    this.gridApi.paginationGoToPage(pageIndex);
    const firstColumnKey = this.gridApi.getColumnState()[0].colId;
    this.gridApi.setFocusedCell(rowIndex, firstColumnKey, null);
    this.gridApi.ensureIndexVisible(rowIndex, 'middle');
    this.sessionStorage.setItem('WrokQueue_Page_Loading', 'N');
  }
  compareObjects(obj1: any, obj2: any): boolean {
    if(obj1 == obj2){
      return true;
    }
    else{
      return false;
    }
  }
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowUp':
          if(this.gridSettings.gridname === 'RecordListingGrid'){
            this.gridApi.setFocusedCell(this.currentRowIndex - 1, 'Record Type');
            this.gridApi.ensureIndexVisible(this.currentRowIndex - 1, 'middle');
          }
            break;
        case 'ArrowDown':
          if(this.gridSettings.gridname === 'RecordListingGrid'){
            if(this.currentRowIndex + 1 < this.TotalRenderedRowIndex){
              this.gridApi.setFocusedCell(this.currentRowIndex + 1, 'Record Type');
              this.gridApi.ensureIndexVisible(this.currentRowIndex + 1, 'middle');
            }
          }
            break;
            case 'ArrowLeft':
              if(this.gridSettings.gridname === 'RecordListingGrid'){
                this.gridApi.setFocusedCell(this.currentRowIndex - 1, 'Record Type');
                this.gridApi.ensureIndexVisible(this.currentRowIndex - 1, 'middle');
              }
            break;
            case 'ArrowRight':
              if(this.gridSettings.gridname === 'RecordListingGrid'){
                if(this.currentRowIndex + 1 < this.TotalRenderedRowIndex){
                  this.gridApi.setFocusedCell(this.currentRowIndex + 1, 'Record Type');
                  this.gridApi.ensureIndexVisible(this.currentRowIndex + 1, 'middle');
                }
              }
            break;
            case 'Tab':
              if(this.gridSettings.gridname === 'RecordListingGrid'){
                if(this.currentRowIndex + 1 < this.TotalRenderedRowIndex){
                  this.gridApi.setFocusedCell(this.currentRowIndex + 1, 'Record Type');
                  this.gridApi.ensureIndexVisible(this.currentRowIndex + 1, 'middle');
                }
              }
            break;
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
    const dataSource = {
      getRows: (params) => {
        let requestUrl = this.gridSettings.apiUrl;
        let reqObj = this.gridSettings.apiRequest;
        reqObj.retrievedCount = params.startRow;
        // Extract sorting model
          const sortModel = params.sortModel.map((sort) => ({
            columnName: sort.colId,
            orderType: sort.sort, // 'asc' or 'desc'
          }));
        // Extract filter model
        const filterModel = Object.keys(params.filterModel).map((colId) => {
          const filter = params.filterModel[colId];
          const tempArray = [];
          tempArray.push(filter.filter, filter.filterTo);
          return {
            columnName: colId,
            operator: filter.type, // For compound filters
            filterValues: filter.type == 'inRange' ? tempArray : filter.filterType == 'date' ? [filter.dateFrom] : [filter.filter]
          };
        });
        reqObj.sortingJson = sortModel;
        reqObj.filters = filterModel;

        this.gridService.execute('POST', requestUrl, reqObj).subscribe({
            next: (response: any) => {
              const rows = response.GridData; // Rows from the server
              const totalRows = response['Workqueue Data Count'];  //Number(this.gridSettings.workqueueTotalCount);
              // const totalRows = response['Workqueue Data Count']; // Total rows in the dataset
              if(response){
                if(response && response.GridData.length == 0) {
                  this.gridAutoHeight('empty');
                } 
                if(response.length == 0 || Object.keys(response).length === 0) {
                  this.gridApi.showNoRowsOverlay();
                } else {
                  this.gridApi.hideOverlay();
                  this.gridApi.hideOverlay();
                  this.sessionStorage.setItem('lsLoaded', 'Y');
                  let loadingStatus = this.sessionStorage.getItem('PDFViewerLoaded');
                  if(loadingStatus === 'Y'){
                    this.loaderService.hideLoader();
                  }
                  this.columnDataFilter.emit(response['columnProperties']);
                  this.filterModelData.emit(filterModel);
                  this.rowData = response['GridData'];
                  this.gridDataEvent.emit(this.rowData);
                  this.rowcount = response.GridData.length;
                  if(this.gridSettings.gridname === 'RecordListingGrid'){
                    this.LastApprovedTorId = response.LastApprovedTorId;
                  }
                  // this.gridAutoHeight('');
                  this.initGrid(response);
                  this.onToolPanelVisibleChanged(response);
                  this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
                }
              } else {
                this.gridAutoHeight('empty');
                this.gridApi.showNoRowsOverlay();
              }
              if (rows.length === 0) {
                params.successCallback([], 0); // Return zero rows
                this.gridApi.showNoRowsOverlay();
              } else {
                params.successCallback(rows, totalRows);
              }
            },
            error: () => {
              this.gridAutoHeight('empty');
              this.gridApi.showNoRowsOverlay();
              params.failCallback();
            },
          });
      },
    };
  
    this.gridApi.setDatasource(dataSource);
  }

  public autoSizeStrategy:
  | SizeColumnsToFitGridStrategy
  | SizeColumnsToFitProvidedWidthStrategy
  | SizeColumnsToContentStrategy = {
  type: "fitGridWidth"
};

  initGrid(data) {
    // console.log(data);
    let gridResponse = data;
    this.gridResponseData = data;
    this.gridOptions.defaultColDef;
    this.gridOptions.columnDefs = [];
    for (let i = 0; i < gridResponse.columnProperties.length; i++) {
      gridResponse.columnProperties[i].id = 'row_' + (i + 1);
      gridResponse.columnProperties[i].showColumn = true;
      
      if(this.gridSettings.gridname === 'Workqueue Grid'){
        if(gridResponse.columnProperties[i].field === 'Batch Number') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 7;
      }
        if(gridResponse.columnProperties[i].field === 'Batch Date') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 8;
          // gridResponse.columnProperties[i].defaultFilterFlag = 'Y';
        } 
        if(gridResponse.columnProperties[i].field === 'Intake Channel') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5.5;
      }
        if(gridResponse.columnProperties[i].field === 'No of Files') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 4.8;
      }
        if(gridResponse.columnProperties[i].field === 'No of Pages') {
        gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        }
        if(gridResponse.columnProperties[i].field === 'Processing Status') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 6;
        }
        if(gridResponse.columnProperties[i].field === 'Processing File Count') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 6.3;
      } 
        if(gridResponse.columnProperties[i].field === 'Error File Count') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 6;
        }
        if(gridResponse.columnProperties[i].field === 'Business Status') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5.5;
        }
        if(gridResponse.columnProperties[i].field === 'File Id') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 7;
        }
        if(gridResponse.columnProperties[i].field === 'Batch Name') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 7;
        }
        if(gridResponse.columnProperties[i].field === 'File Name') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 6;
        }
        if(gridResponse.columnProperties[i].field === 'File Date') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 8;
        }
        if(gridResponse.columnProperties[i].field === 'File Status') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 7;
        }
      }

      if(this.gridSettings.gridname === 'AssignReAssignGrid'){
        if(gridResponse.columnProperties[i].field === 'Doc ID') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 3;
        } 
        if(gridResponse.columnProperties[i].field === 'Doc Name') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 4;
        } 
        if(gridResponse.columnProperties[i].field === 'Case ID') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 1;
        } 
        if(gridResponse.columnProperties[i].field === 'Pages') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 1;
        } 
        if(gridResponse.columnProperties[i].field === 'Priority') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 1;
        }
        if(gridResponse.columnProperties[i].field === 'Status') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 3;
        }
        if(gridResponse.columnProperties[i].field === 'Current Owner') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 15;
        }
        if(gridResponse.columnProperties[i].field === 'New Owner') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 15;
        }
      }
      if(this.gridSettings.gridname === 'AssignReAssignTaskGrid'){
        if(gridResponse.columnProperties[i].field === 'Task ID') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        } 
        if(gridResponse.columnProperties[i].field === 'Doc ID') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 3;
        } 
        if(gridResponse.columnProperties[i].field === 'Task Name') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 4;
        } 
        if(gridResponse.columnProperties[i].field === 'Pages') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 0.5;
        } 
        if(gridResponse.columnProperties[i].field === 'Status') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 3;
        }
        if(gridResponse.columnProperties[i].field === 'Current Owner') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 15;
        }
        if(gridResponse.columnProperties[i].field === 'New Owner') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 15;
        }
      }

      if(this.gridSettings.gridname === 'SetPriorityGrid'){
        if(gridResponse.columnProperties[i].field === 'Doc ID') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 3;
        } 
        if(gridResponse.columnProperties[i].field === 'Doc Name') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 4;
        } 
        if(gridResponse.columnProperties[i].field === 'Case ID') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 1;
        } 
        if(gridResponse.columnProperties[i].field === 'Pages') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 1;
        } 
        if(gridResponse.columnProperties[i].field === 'Status') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 3;
        }
        if(gridResponse.columnProperties[i].field === 'Case Owner') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 10;
        }
        if(gridResponse.columnProperties[i].field === 'Current Priority') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 10;
        }
        if(gridResponse.columnProperties[i].field === 'New Priority') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 10;
        }
      }
      
      if(this.gridSettings.gridname.includes('CaseDetail')){
        //Establish Case Grid 1
        if(gridResponse.columnProperties[i].field === 'VAERS ID') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        } 
        if(gridResponse.columnProperties[i].field === 'Patient Name') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        } 
        if(gridResponse.columnProperties[i].field === 'DOB') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        } 
        if(gridResponse.columnProperties[i].field === 'Age') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        } 
        if(gridResponse.columnProperties[i].field === 'Gender') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        }
        //Establish Case Grid 2
        if(gridResponse.columnProperties[i].field === 'Doc Date') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        }
        if(gridResponse.columnProperties[i].field === 'Doc Info') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        }
        if(gridResponse.columnProperties[i].field === 'Status') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        }
        if(gridResponse.columnProperties[i].field === 'Date') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        }
        if(gridResponse.columnProperties[i].field === 'Pages') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 5;
        }
      }

      if(this.gridSettings.gridname === 'RecordListingGrid'){
      if(gridResponse.columnProperties[i].field === 'Page No') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
            gridResponse.columnProperties[i].columnWidthValue = 5;
          }
          if(gridResponse.columnProperties[i].field === 'Record Type') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
            gridResponse.columnProperties[i].columnWidthValue = 20;
          }
          if(gridResponse.columnProperties[i].field === 'Action') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 0.00001;
          } 
          if(gridResponse.columnProperties[i].field === 'Edit') {
          gridResponse.columnProperties[i].columnWidthType = 'fitContent';
          gridResponse.columnProperties[i].columnWidthValue = 0.00001;
          } 
        } 
        
      if(this.gridSettings.gridname === 'reportsGrid'){
        if(gridResponse.columnProperties[i].field === 'Start Date') {
            gridResponse.columnProperties[i].columnWidthType = 'fitContent';
              gridResponse.columnProperties[i].columnWidthValue = 10;
            }
            if(gridResponse.columnProperties[i].field === 'End Date') {
            gridResponse.columnProperties[i].columnWidthType = 'fitContent';
              gridResponse.columnProperties[i].columnWidthValue = 10;
            }
            if(gridResponse.columnProperties[i].field === 'Download') {
            gridResponse.columnProperties[i].columnWidthType = 'fitContent';
            gridResponse.columnProperties[i].columnWidthValue = 10;
            } 
          } 


      if(gridResponse.columnProperties[i].field === 'Action' || gridResponse.columnProperties[i].field === 'Edit'  || gridResponse.columnProperties[i].field === 'Download') {
        gridResponse.columnProperties[i].suppressColumnName = 'Y';
        gridResponse.columnProperties[i].columnName = '';
      } else {
        gridResponse.columnProperties[i].suppressColumnName = 'N';
      }

      // if(gridResponse.columnProperties[i].columnType ==='headerContent') {
      //     this.headerColumn();
      // } else if(gridResponse.columnProperties[i].columnType ==='cellContent') {

      // }

     

      this.sessionStorage.setObj('gridFilter',JSON.stringify(gridResponse.columnProperties));

      this.gridOptions.columnDefs.push({
        headerName: gridResponse.columnProperties[i].columnName,
        // headerClass: gridResponse.columnProperties[i]['dataType'] == 'int' ? "ag-right-aligned-header grid-no-drag" :  'ag-theme-custom-text-right',
        headerClass : this.headerClass(gridResponse.columnProperties[i]) ,
        field: gridResponse.columnProperties[i].field,

        type: gridResponse.columnProperties[i]['dataType']
           ? this.columnDataTypeMap[gridResponse.columnProperties[i]['dataType']]
           : 'stringColumn',
        filter:  gridResponse.columnProperties[i]['dataType']
        ? this.columnFilterTypes[this.columnDataTypeMap[gridResponse.columnProperties[i]['dataType']]]['filter']
        : 'agTextColumnFilter',

        // filterParams: (gridResponse.columnProperties[i]['dataType'] === 'date' || gridResponse.columnProperties[i]['dataType'] === 'datetime' || gridResponse.columnProperties[i]['dataType'] === 'Date') ? this.filterParams : (gridResponse.columnProperties[i]['dataType'] === 'nvarchar' || gridResponse.columnProperties[i]['dataType'] === 'varchar') ? this.textFilterParams : '',
        filterParams: (gridResponse.columnProperties[i]['dataType'] === 'date' || gridResponse.columnProperties[i]['dataType'] === 'datetime' || gridResponse.columnProperties[i]['dataType'] === 'Date') ? this.filterParams : (gridResponse.columnProperties[i]['dataType'] === 'nvarchar' || gridResponse.columnProperties[i]['dataType'] === 'varchar') ? this.filterTextParamDefault : this.filterIntegerParamDefault,

        cellEditor: 'agTextCellEditor' ,
        cellRenderer: gridResponse.columnProperties[i]['hyperlink'] === 'Y' ? HyperlinkRendererComponent : gridResponse.columnProperties[i]['action'] === 'Y' ? ActionRendererComponent :  gridResponse.columnProperties[i]['statusIcon'] === 'Y' ? StatusRendererComponent : gridResponse.columnProperties[i]['dynamicStatusIcon'] === 'Y' ? DynamicIconRendererComponent : gridResponse.columnProperties[i]['selectDropdown'] === 'Y' ? SelectRendererComponent : gridResponse.columnProperties[i]['button'] === 'Y' ? ButtonRendererComponent:'',
        cellRendererParams: gridResponse.columnProperties[i]['hyperlink'] === 'Y' ? {
          onClick: this.onClick.bind(this),
          onClick2: this.onClick2.bind(this)
        } : gridResponse.columnProperties[i]['action'] === 'Y' ? {
          onClick: this.onClick.bind(this)
        } : gridResponse.columnProperties[i]['statusIcon'] === 'Y' ? {
          onClick: this.onClick.bind(this)
        } : gridResponse.columnProperties[i]['selectDropdown'] === 'Y' ? {
          ownerDropdown: this.gridSettings.gridDropdownData,
          setValue: this.setValue.bind(this),
        } : gridResponse.columnProperties[i]['button'] === 'Y' ? {
          onClick: this.onClickBtn.bind(this)
        } : '',

        width: gridResponse.columnProperties[i].columnWidthType === 'fitContent' ?  Number(gridResponse.columnProperties[i].columnWidthValue) *  10 : gridResponse.columnProperties[i].columnWidthType === 'headerContent' ? this.calculateWidth(gridResponse.columnProperties[i].columnName) : this.calculateMaxCellWidth(gridResponse.columnProperties[i].columnName),

        headerTooltip: gridResponse.columnProperties[i].columnName,

        tooltipField: gridResponse.columnProperties[i].field,

        hide: gridResponse.columnProperties[i]['visibilityFlag'] ? gridResponse.columnProperties[i]['visibilityFlag'] === 'N' ? true :  false : false,

        suppressColumnsToolPanel: gridResponse.columnProperties[i].suppressColumnName ? gridResponse.columnProperties[i].suppressColumnName === 'N' ? false : false : false,

        suppressFiltersToolPanel: gridResponse.columnProperties[i].suppressColumnName ? gridResponse.columnProperties[i].suppressColumnName === 'N' ? false : false : false,

        cellStyle: (gridResponse.columnProperties[i]['dataType'] == 'int' || (this.gridSettings.gridname == 'Workqueue Grid' && gridResponse.columnProperties[i].field == 'Progress')) ? { 'text-align': 'right', 'justify-content': 'right !important;' } : (params) => {
          if (params.value && params.value.length < 50) {
              return { 
                'text-align': 'left',
                // 'white-space': 'nowrap', // To prevent wrapping for shorter content
                // 'word-wrap': 'break-word',
                'color': params.colDef.field == 'File Status' ? params.value == 'Green' ? '#557D50' : params.value == 'Amber - Pending Audit' ? '#CA7D2F' : params.value == 'Red - Pending Audit' ? '#B0483B' : params.value == 'Exception' ? '#893951' : '' : params.colDef.field == 'Processing Status' ? params.value == 'Fully Completed' || params.value == 'Completed' ? 'green' :  params.value == 'Processing Incomplete' ? '#483D8B' : params.value == 'Not Started' ? '#702038' : params.value == 'In Progress' ? '#e77d22' : params.value == 'Archived' ? 'blue' : params.value == 'Aborted' ? 'red' : params.value == 'Not started' ? 'LightSalmon' : 'black' : params.colDef.field == 'Business Status' ? params.value == 'Processing Incomplete' ? '#483D8B' : params.value == 'Pending Audit' ? 'LightSalmon' : params.value == 'Not Started' ? '#702038' : params.value == 'In Progress' ? '#e77d22' : params.value == 'Aborted' ? 'red' : params.value == 'Pending Processing' ? 'Fuchsia' : params.value == 'Archived' ? 'blue' : params.value == 'Audit Completed' ? 'green' : 'black' : 'black',
                'line-height': 'normal', /* Adjust as needed */
                'padding': '5px' /* Adjust padding for spacing */ 
              };
          } else {
              return {
                  'text-align': 'left',
                  // 'white-space': 'normal',
                  // 'word-wrap': 'break-word',
                  'line-height': 'normal', /* Adjust as needed */
                  'padding': '5px' /* Adjust padding for spacing */ 
              };
          }
      },

        cellClass: null,

        editable: gridResponse.columnProperties[i]['Editable'] ? gridResponse.columnProperties[i]['Editable'] === 'Y' ? true :  false : false,

        suppressMenu: gridResponse.columnProperties[i].suppressColumnName ? gridResponse.columnProperties[i].suppressColumnName === 'N' ? true : false : false,

        floatingFilter: gridResponse.columnProperties[i].suppressColumnName ? gridResponse.columnProperties[i].suppressColumnName === 'N' ? false : false : false,

        checkboxSelection: gridResponse.columnProperties[i].checkboxSelection ? gridResponse.columnProperties[i].checkboxSelection === 'Y' ? true : false : false,

        headerCheckboxSelection: gridResponse.columnProperties[i]['columnName'] == 'File Id' ? true : false, 

        autoHeight: true,

        suppressMovable: !this.gridSettings.gridname.includes('CaseDetail') &&  !this.gridSettings.gridname.includes('AssignReAssignGrid') && !this.gridSettings.gridname.includes('AssignReAssignTaskGrid') && !this.gridSettings.gridname.includes('SetPriorityGrid') && this.gridSettings.gridname !== 'RecordListingGrid'  && this.gridSettings.gridname !== 'reportsGrid' ? false : true,

        sortable: gridResponse.columnProperties[i].suppressColumnName ? gridResponse.columnProperties[i].suppressColumnName === 'N' ? true : false : true,

        suppressHeaderMenuButton : true,

      });
      
      // console.log(this.gridOptions.columnDefs);
    }
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      // this.selectAllRows();
      
      if(this.selectAllEnabled) {
        const selectedAllCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedAllFileDetails"));
        const displayedNodes = this.gridApi.getRenderedNodes();
        selectedAllCaseDetails.forEach(item => {
          displayedNodes.forEach(node => {
            if(node.data.Case_Id == item.Case_Id) {
              if(item.isSelect) {
                node.setSelected(true)
              } else {
                node.setSelected(false)
              }
            }
          });
        })

        const columnDefs = this.gridOptions.columnDefs;
        if (columnDefs) {
          columnDefs.forEach((colDef: any) => { 
            if(colDef.floatingFilter && this.selectAllEnabled) {
              colDef.floatingFilter = false
              this.gridApi!.setSideBar(false);
            } else {
              colDef.floatingFilter = true
              const tempSideObj = {
                toolPanels: [
                {
                  id: 'filter',
                  labelDefault: 'Filter',
                  labelKey: 'filter',
                  iconKey: 'filter',
                  toolPanel: 'agFiltersToolPanel',
                  minWidth: 0.5,
                  width: 0.5,
                  maxWidth: 0.5,
                }
              ],
              defaultToolPanel: "filters"
            }
              this.gridApi!.setSideBar(tempSideObj);
            }
          });
          // Trigger refresh of the grid to apply the changes
          this.gridApi.setColumnDefs(columnDefs);
          this.gridApi.sizeColumnsToFit();
        }

      }
    }, 100);
  }

  /**
   * Header Column Class
   * @param columnData 
   */

  headerClass(columnData : any) {
    if(columnData['dataType'] === 'int' && columnData.suppressColumnName === 'Y') {
      return 'ag-right-aligned-header grid-no-drag';
    } else if(columnData['dataType'] === 'int' && columnData.suppressColumnName === 'N') {
      return 'ag-right-aligned-header';
    } else if(columnData['dataType'] === 'varchar' && this.gridSettings.gridname == 'Workqueue Grid' && columnData.field == 'Progress') {
      return 'ag-right-aligned-header';
    } else if(columnData['dataType'] != 'int' && columnData.suppressColumnName === 'Y') {
      return 'ag-theme-custom-text-right grid-no-drag';
    } else if(columnData['dataType'] != 'int' && columnData.suppressColumnName === 'N') {
      return 'ag-theme-custom-text-right';
    } 
     return 'ag-theme-custom-text-right';
  }

  calculateWidth(headerText: string): number {
    // Calculate width based on header text length or any other criteria
    return headerText.length * 10; // Adjust multiplier according to your needs
  }

  calculateWidthForRow(headerText: string): number  {
    if(headerText != null && headerText != "" && headerText != undefined) {
      return headerText.length * 8; 
    } else {
      return 0;
    }
    
  }

  // Function to calculate maximum width of cell content in a column
calculateMaxCellWidth(columnName: string): any {
  let maxWidth = 0;
  this.rowData.forEach(row => {
      const cellValue = row[columnName];
      const cellWidth = cellValue !== null && cellValue !== undefined ? this.calculateWidthForRow(cellValue): 0;
      if (cellWidth > maxWidth) {
          maxWidth = cellWidth;
      }
  });
  if(maxWidth > 500) {
    return maxWidth - 250;
  } else if (maxWidth <= 200) {
    return maxWidth + 25;
  } else if(maxWidth > 200 && maxWidth <= 500) {
    return maxWidth + 20;
  }
  
}
   
 
  // Event handler for tool panel visibility change
  onToolPanelVisibleChanged(event: ToolPanelVisibleChangedEvent) {
      const columnDefs = this.gridOptions.columnDefs;
      if (columnDefs) {
        columnDefs.forEach((colDef: any) => { 
          if(colDef.field != "Action" && colDef.field != "Edit" && colDef.field != "Download") {
            colDef.floatingFilter = !colDef.floatingFilter // Set floatingFilter based on tool panel visibility
            if(colDef.floatingFilter){
              this.manualGridHeight();
            }
          } else {
            colDef.suppressColumnsToolPanel = true;
            colDef.suppressFiltersToolPanel = true;
          }
        });
        // Trigger refresh of the grid to apply the changes
        this.gridApi.setColumnDefs(columnDefs);
      }
    this.gridApi.sizeColumnsToFit();
    // this.gridApi.refreshToolPanel();
    // this.gridApi.setFilterModel(null);
    // this.gridAutoHeight();
      // this.gridApi.closeToolPanel();
  }

   // Customize context menu items
   getContextMenuItems(params: any) {
    const defaultContextMenuItems = params.defaultItems; // Get the default context menu items

    // Filter out csvExport and excelExport items
    const filteredContextMenuItems = defaultContextMenuItems.filter(item =>
      item === "export" || item === 'excelExport' ? false : true
    );

    return filteredContextMenuItems;
  }

  /**
   * Get Row Style
   */
  getRowStyle = params => {
    if(params.data)
    if (params.data['Row Colour'] != null) {
        return { background: params.data['Row Colour'] };
    }
    return null;
  };


  onCellValueChanged(params) {
    // console.log(event);
  }

  onClick(params) {
    console.log('params', params);
    const colDef = this.gridApi.getColumnDef(params.column.getColId());
    
    // Extract the column name (headerName)
    const columnName = colDef.field;
    
    // Do something with the column name
    // console.log('Column Name:', columnName);
    const allRowData = [];
    this.gridApi.forEachNode((node) => {
      allRowData.push(node.data);
    });
    // console.log('allRowData:', allRowData);
    let cellRendererName = columnName == 'Edit' ? 'ActionRendererComponent': (columnName == 'Page No' || columnName == 'Doc ID' || columnName == 'Batch Number' || columnName == 'Processing File Count' || columnName == 'Error File Count') ? 'HyperlinkRendererComponent' : columnName == 'Doc Name' ? 'StatusRendererComponent' : colDef.cellRenderer.prototype.constructor.name;
    // console.log('cellRendererName:', cellRendererName);
    let output = {
      From: cellRendererName,
      Data: params.data,
      AllData: allRowData,
      id: 1,
      Type: 'Click',
      columnName: columnName
    }
    // console.log('output:', output);
    if(cellRendererName === 'HyperlinkRendererComponent' || cellRendererName === 'ActionRendererComponent' || cellRendererName === 'StatusRendererComponent'){
      
      if(this.gridSettings.gridname === 'RecordListingGrid' && cellRendererName === 'ActionRendererComponent' && this.recordListingPageType == 'editable'){
        // console.log('Condition statisfied');
        if(params.data.action == 'fa-regular fa-thumbs-down'){
          params.data.action = 'fa-solid fa-thumbs-down';
          params.data.actionColour = '#dc3545';
          this.gridClickEvent.emit(output);
          let rowNode = this.gridApi.getRowNode(params.rowIndex);
          if (rowNode) {
            rowNode.setData(params.data);
            this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
          }
        }
        else if(params.data.action == 'fa-solid fa-thumbs-down'){
          params.data.action = 'fa-regular fa-thumbs-down';
          params.data.actionColour = '';
          this.gridClickEvent.emit(output);
          let rowNode = this.gridApi.getRowNode(params.rowIndex);
          if (rowNode) {
            rowNode.setData(params.data);
            this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
          }
        }
      }
      if(cellRendererName === 'HyperlinkRendererComponent'){
        this.gridClickEvent.emit(output);
        
        if(this.gridSettings.gridname == 'Workqueue Grid') {
          // this.loaderService.showLoader();
          let selectedRowDetails = params.data;
          selectedRowDetails.GridName = this.gridSettings.gridname;
          selectedRowDetails.rowIndex = params.rowIndex;
          this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(selectedRowDetails))
        }
      }
      if(cellRendererName === 'StatusRendererComponent' && this.gridSettings.gridname === 'Workqueue Grid'){
        if(this.gridSettings.gridname == 'Workqueue Grid') {
          let selectedRowDetails = params.data;
          selectedRowDetails.GridName = this.gridSettings.gridname;
          selectedRowDetails.rowIndex = params.rowIndex;
          this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(selectedRowDetails))
        }
        this.gridClickEvent.emit(output);
      }
    }
  }

  onClick2(params) {
    console.log('params2', params);
    const colDef = this.gridApi.getColumnDef(params.column.getColId());
    
    // Extract the column name (headerName)
    const columnName = colDef.field;
    
    // Do something with the column name
    // console.log('Column Name:', columnName);
    const allRowData = [];
    this.gridApi.forEachNode((node) => {
      allRowData.push(node.data);
    });
    // console.log('allRowData:', allRowData);
    let cellRendererName = columnName == 'Edit' ? 'ActionRendererComponent': (columnName == 'Page No' || columnName == 'Doc ID') ? 'HyperlinkRendererComponent' : columnName == 'Doc Name' ? 'StatusRendererComponent' : colDef.cellRenderer.prototype.constructor.name;
    // console.log('cellRendererName:', cellRendererName);
    let output = {
      From: cellRendererName,
      Data: params.data,
      id: 2,
      AllData: allRowData,
      Type: 'Click'
    }
    console.log('output2', output);
    if(cellRendererName === 'HyperlinkRendererComponent'){
      // this.loaderService.showLoader();
      let selectedRowDetails = params.data;
      selectedRowDetails.GridName = this.gridSettings.gridname;
      selectedRowDetails.rowIndex = params.rowIndex;
      this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(selectedRowDetails))
      this.gridClickEvent.emit(output);
    }
  }

  setValue(value: any, caseId, taskId) {
    // Handle the updated value here, such as updating the rowData
    let obj = {}
    if(this.gridSettings.gridname == 'AssignReAssignGrid') {
       obj = {
        "case_id": caseId,
        "owner_id": value,
        "type": this.gridSettings.gridname
      }
    } else if(this.gridSettings.gridname == 'AssignReAssignTaskGrid') {
      obj = {
       "task_id": taskId,
       "owner_id": value,
       "type": this.gridSettings.gridname
     }
   } else if(this.gridSettings.gridname == 'SetPriorityGrid') {
       obj = {
        "case_id": caseId,
        "priority": value,
        "type": this.gridSettings.gridname
      }
    } 
    this.cellDropDownEmit.emit(obj)
  }



  /**
   * Export to Excel Event
   */

  onBtExport() {
    // const params = {
    //   columnGroups: false,
    //   allColumns: true,
    //   fileName: this.getCurrentTimeFormat()
    // };
    let excelName =  this.sessionStorage.getItem("excelName");
    let fileName = excelName + '_' + this.getCurrentTimeFormat();
    const params = {
      fileName: fileName,
      sheetName: 'Data',
      // processCellCallback: params => {
      //   // Check if the row has a background color set
      //   if (params.node.data.bgColor) {
      //     console.log(params.node.data);
      //     // Set the background color of the Excel cell
      //     params.node.data.excelStyles = [{ id: 'cell', interior: { color: params.node.data.bgColor } }];
      //   }
      //   return params.value;
      // }
    };
    // console.log(params);
    this.gridApi.exportDataAsExcel(params);
  }


   // Helper method to get current time format
   getCurrentTimeFormat(): string {
    const date = new Date();
    // return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes() ;
  }


// Function to set the grid height dynamically
manualGridHeight(){
  if(this.gridSettings.id == 'WorkqueueInsights'){
    this.autoHeight = false;
    this.pagination = true;
    this.customTableHeight = '520px';
  }
  else{
    if(this.rowData.length === 1) {
      this.setGridHeight(230);
    } else if (this.rowData.length > 1 && this.rowData.length <=3) {
      this.setGridHeight(285);
    } else if(this.rowData.length > 3  && this.rowData.length <= 5) {
      this.setGridHeight(370);
    } else if(this.rowData.length > 5 && this.rowData.length <= 7) {
      this.setGridHeight(410);
    } else if(this.rowData.length > 7 && this.rowData.length <= 9) {
      this.setGridHeight(475);
    } else {
      this.setGridHeight(500);
    }
  }
}
 setGridHeight(height) {
    this.pagination = true;
    this.autoHeight = false;
    this.customTableHeight = `${height}px`;
  }
  gridAutoHeight(from){
    if(this.gridSettings.id == 'WorkqueueInsights'){
      this.autoHeight = false;
      this.pagination = true;
      this.customTableHeight = '550px';
    }
    else{
      this.pagination = false;
      this.autoHeight = false;
      if(from == 'empty'){
        this.customTableHeight = '150px';
      }
      else{
        if(this.rowcount == 0) {
          this.customTableHeight = '150px';
        } 
        else if (this.rowcount > 0 && this.rowcount <= 9) {
          this.pagination = true;
          this.manualGridHeight();
          // this.autoHeight = true;
          // this.gridApi.setDomLayout('autoHeight');
        } 
        else {
          this.pagination = true;
          this.customTableHeight = '520px';
        }
      }
    }
  }
  onClickBtn(params){
    console.log(params);
    let filename = params.data.File_Name;
    const filePath = `assets/Reports/${filename}`;
    this.http.get(filePath, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }
  onSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
  
    if (!this.gridApi) {
      console.error('Grid API not initialized!');
      return;
    }

    // Reset the all data selected flag when using the checkbox
    this.isAllDataSelected = false;

    const displayedNodes = this.gridApi.getRenderedNodes();
  
    if (isChecked) {
      this.selectAllEnabled = true;
      this.selectAllEvent.emit(this.selectAllEnabled);
      displayedNodes.forEach(node => node.setSelected(true));
      this.selectedRowCount = displayedNodes.length;
    } else {
      this.selectAllEnabled = false;
      this.selectAllEvent.emit(this.selectAllEnabled);
      displayedNodes.forEach(node => node.setSelected(false));
      this.selectedRowCount = 0;
    }
    this.sessionStorage.setItem("isSelectAllSelected", this.selectAllEnabled);


    const columnDefs = this.gridOptions.columnDefs;
    if (columnDefs) {
      columnDefs.forEach((colDef: any) => { 
        if(colDef.floatingFilter && this.selectAllEnabled) {
          colDef.floatingFilter = false
          this.gridApi!.setSideBar(false);
        } else {
          colDef.floatingFilter = true
          const tempSideObj = {
            toolPanels: [
            {
              id: 'filter',
              labelDefault: 'Filter',
              labelKey: 'filter',
              iconKey: 'filter',
              toolPanel: 'agFiltersToolPanel',
              minWidth: 0.5,
              width: 0.5,
              maxWidth: 0.5,
            }
          ],
          defaultToolPanel: "filters"
        }
          this.gridApi!.setSideBar(tempSideObj);
        }
      });
      // Trigger refresh of the grid to apply the changes
      this.gridApi.setColumnDefs(columnDefs);
      this.gridApi.sizeColumnsToFit();
    }
  }

  selectAllRows() {
    if (this.selectAllEnabled) {
      this.selectAllEnabled = true;
      this.selectAllEvent.emit(this.selectAllEnabled);
    this.gridApi.forEachNode((node) => {
      node.setSelected(true);
      node.rowDisabled = true;
      this.selectedRowIds.add(node.id!);
    });
  } else {
    this.selectAllEnabled = false;
    this.selectAllEvent.emit(this.selectAllEnabled);
    this.gridApi.forEachNode((node) => {
      node.setSelected(false);
      node.rowDisabled = false;
      this.selectedRowIds.delete(node.id!);
    });
  }
  }

  getSelectedRowIds(): string[] {
    return Array.from(this.selectedRowIds);
  }

}
