
import { EcareSimpleGridSettings } from "./gridsettings.modal";

interface EcareGridSettings {
  enableSorting?: boolean;
  enableFilter?: boolean;
  enableRowSelection?: boolean;
  apiUrl?: string;
  apiRequest?;
  apiMethod?: string;
  columns?;
  staticColumns?: boolean;
  actionColumns?: Array<object>;
  linkableField?: string;
  sidebar?;
  exceloption?;
  pagination?: boolean;
  floatingFilter?: boolean;
  colWidth?;
  rowSelection?;
  checkboxSelection?;
  checklocaljson?: boolean;
  localjson?;
  firstColumnNotPinned?: boolean;
  gridname?;
  floatingOption?: boolean;
  sideBar?;
  viewFloatingOption?: boolean;
  deleteFloatingOption?: boolean;
  updateFloatingOption?: boolean;
  initiateFloatingOption?: boolean;
  gridFeatures?;
  rowModelType?: string;
  noDataErrorMessage?: string;
  firstRowSelection?: boolean;
  filterValue?;
  iconColumn?;
  checkboxSelectionField?;
  checkboxSelectionData?;
  DimensionName?;
  pageNumber?;
  enablecustomTooltip?: boolean;
  rowHeight?;
  floatingIconArray?;
  rowDrag?;
  inlineEditFields?;
  sizeColumnToFit?: boolean;
  measureId?;
  oldFileId?;
  newFileId?;
  gridAddData?;
}

interface EcareChartSettings {
  chartType?: string;
}

export interface WidgetSettings extends EcareGridSettings, EcareChartSettings, EcareSimpleGridSettings {
  class?: string;
  id?: string;
  cellEditable?: boolean;
  exportToExcel?: boolean;
  actionColumns?;
  noDataErrorMessage?;
}
