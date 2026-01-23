export class EcareGridSettings {
    class?: string = 'ecare-data-grid';
    id?: string;
    enableSorting?: boolean = false;
    enableFilter?: boolean = false;
    enableRowSelection?: boolean = false;
    apiUrl?: string;
    apiRequest?: any;
    apiMethod?: string;
    columns?: any;
    staticColumns?: boolean;
    actionColumns?: Array<object>;
    linkableField?: string;
    checklocaljson?: boolean;
    localjson?: any;
    gridname?: any;
    sidebar?: any;
    exceloption?: any;
    pagination?: boolean = false;
    floatingFilter?: boolean;
    colWidth?: any;
    floatingOption?: boolean = false;
    rowSelection?: any;
    viewFloatingOption?: boolean = false;
    deleteFloatingOption?: boolean = false;
    updateFloatingOption?: boolean = false;
    initiateFloatingOption?: boolean = false;
    inlineEditFields?:any;
    workqueueTotalCount?: any;
    sizeColumnToFit?: boolean;
    firstRowSelection?:boolean;
    noDataErrorMessage?:string;
    exportToExcel?:boolean;
    gridHeight?:string;
    gridDropdownData?:  Array<object>;
    workqueueGridType?: string;
  }
  