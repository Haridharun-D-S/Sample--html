import { Component } from '@angular/core';
import { HighchartsOptions } from '@novacisdigital/nd-custom-highcharts';
import { cssWidgetCode, htmlWidgetCode, tsWidgetCode } from './widgetCode';
import { JsonService } from 'src/app/shared/service/service.service';

const SIZE_ORDER: WidgetSize[] = ['small', 'medium', 'large', 'large-x'];

export interface WidgetConfig {
  id: number;
  title: string;
  type: 'grid' | 'chart';
  size: string;
  infoActionGroup?: any;
  widgetFilterOptions?: any;
  data?: any;
}

type WidgetSize = 'small' | 'medium' | 'large' | 'large-x';
@Component({
  selector: 'app-nd-widget',
  templateUrl: './nd-widget.component.html',
  styleUrls: ['./nd-widget.component.scss'],
})
export class NdWidgetComponent {
  widgets: WidgetConfig[] = [];
  sizeType: WidgetSize = 'large';
  sizeTypeChart: WidgetSize = 'medium';
  widgetCode = htmlWidgetCode;
  cssWidgetCode = cssWidgetCode;
  tsWidgetCode = tsWidgetCode;
  widgetList: any[] = [];
  widgetConfigOptions: any[] = [];
  widgetOutputEvents: any[] = [];
  constructor( readonly service : JsonService) {

    this.widgetList = [
      {
        sizeType: 'large-x',
        title: 'Grid',
        infoActionGroupAccess: {
          default: true,
          showSave: true,
          showInfo: true,
          disableSave: true,
          disableInfo: false,
        },
        widgetFilterOptions: {
          firstDropdownValue: {
            label: 'Time',
            dropdownOptions: [
              { value: '01/01/2025 - 01/31/2025', id: '1' },
              { value: '02/01/2025 - 02/28/2025', id: '2' },
              { value: '03/01/2025 - 03/31/2025', id: '3' },
              { value: '04/01/2025 - 04/30/2025', id: '4' },
            ],
            show: true,
          },
          secondDropdownValue: {
            label: 'Organization',
            dropdownOptions: [
              { value: 'Highcharts', id: '1' },
              { value: 'AG Grid', id: '2' },
              { value: 'PDF Viewer', id: '3' },
              { value: 'Dynamic Form', id: '4' },
            ],
            show: true,
          },
        },
      },
      {
        sizeType: 'large',
        title: 'charts',
        infoActionGroupAccess: {
          default: true,
          showSave: true,
          showInfo: true,
          disableSave: true,
          disableInfo: false,
        },
        widgetFilterOptions: {
          firstDropdownValue: {
            label: 'Time',
            dropdownOptions: [
              { value: '01/01/2025 - 01/31/2025', id: '1' },
              { value: '02/01/2025 - 02/28/2025', id: '2' },
              { value: '03/01/2025 - 03/31/2025', id: '3' },
              { value: '04/01/2025 - 04/30/2025', id: '4' },
            ],
            show: true,
          },
          secondDropdownValue: {
            label: 'Organization',
            dropdownOptions: [
              { value: 'Highcharts', id: '1' },
              { value: 'AG Grid', id: '2' },
              { value: 'PDF Viewer', id: '3' },
              { value: 'Dynamic Form', id: '4' },
            ],
            show: true,
          },
        },
      },
    ];
  }

  rowData: any[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    make: ['ToyotaToyota', 'Ford', 'Pors', 'BMW', 'Audi'][i % 5],
    model: ['Celica', 'MondeoMondesa', 'Boxster', '3 Series', 'A4'][i % 5],
    price: 25000 + i * 1000,
    year: 2010 + (i % 10),
    color: ['Red', 'Blue', 'Black', 'White', 'Grey'][i % 5],
    vin: `VIN${100000 + i}`,
    owner: `Owner ${i + 1}`,
    location: ['NY', 'LA', 'TX', 'FL', 'WA'][i % 5],
    status: ['Active', 'Sold', 'In Service'][i % 3],
    engine: ['V6', 'V8', 'Electric', 'Hybrid'][i % 4],
    mileage: 10000 + i * 500,
    registrationDate: `20${10 + (i % 10)}-01-${(i % 28) + 1}`,
    insurance: ['Yes', 'No'][i % 2],
    serviceDue: `20${24 - (i % 3)}-12-${(i % 28) + 1}`,
    isChecked: i % 2 === 0,
  }));

  columnDefs: any[] = [
    {
      field: 'id',
      headerName: 'ID',
      filter: 'agNumberColumnFilter',
      width: 50,
      checkboxSelection: true,
      headerTooltip: 'This is the Age column',
      filterParams: {
        suppressAndOrCondition: true,
      },
    },
    { field: 'make', headerName: 'Make', width: 200 },
    {
      field: 'model',
      headerName: 'Model',
      filter: 'agTextColumnFilter',
      width: 200,
      autoHeight: true,
      filterParams: {
        suppressAndOrCondition: true,
      },
    },
    { field: 'price', headerName: 'Price', width: 200, hide: true },
    {
      field: 'year',
      headerName: 'Year',
      width: 200,
      filter: 'agDateColumnFilter',
    },
    { field: 'color', headerName: 'Color', width: 200 },
    { field: 'vin', headerName: 'VIN', width: 200 },
    { field: 'owner', headerName: 'Owner', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 },
    { field: 'engine', headerName: 'Engine', width: 200 },
    { field: 'mileage', headerName: 'Mileage', width: 200 },
    { field: 'registrationDate', headerName: 'Registered', width: 200 },
    { field: 'insurance', headerName: 'Insurance', width: 200 },
    { field: 'serviceDue', headerName: 'Service Due', width: 200 },
  ];

  chartOptions: HighchartsOptions = {
    chart: { type: 'pie' },
    title: { text: 'My Chart' },
    series: [
      {
        type: 'pie',
        data: [
          ['A', 1],
          ['B', 2],
          ['C', 3],
        ],
      },
    ],
  };
  widgetFilterOptions = {
    firstDropdownValue: {
      label: 'Time',
      dropdownOptions: [
        { value: '01/01/2025 - 01/31/2025', id: '1' },
        { value: '02/01/2025 - 02/28/2025', id: '2' },
        { value: '03/01/2025 - 03/31/2025', id: '3' },
        { value: '04/01/2025 - 04/30/2025', id: '4' },
      ],
      show: true,
    },
    secondDropdownValue: {
      label: 'Organization',
      dropdownOptions: [
        { value: 'Highcharts', id: '1' },
        { value: 'AG Grid', id: '2' },
        { value: 'PDF Viewer', id: '3' },
        { value: 'Dynamic Form', id: '4' },
      ],
      show: true,
    },
  };

  infoActionGroupAccess = {
    default: true,
    showSave: true,
    showInfo: true,
    disableSave: true,
    disableInfo: false,
  };
  widgetActionClicked(action: string, index: number): void {
    const SIZE_ORDER = ['small', 'medium', 'large', 'large-x']; // Define order if not global

    const currentWidget = this.widgetList[index];
    if (!currentWidget) return;

    const currentIndex = SIZE_ORDER.indexOf(currentWidget.sizeType);

    switch (action) {
      case 'Increase':
        if (currentIndex < SIZE_ORDER.length - 1) {
          currentWidget.sizeType = SIZE_ORDER[currentIndex + 1];
        }
        break;

      case 'Decrease':
        if (currentIndex > 0) {
          currentWidget.sizeType = SIZE_ORDER[currentIndex - 1];
        }
        break;

      case 'Collapse':
        currentWidget.sizeType = 'small';
        break;

      case 'FullViewWidget':
        currentWidget.sizeType = 'large-x';
        break;

      default:
        break;
    }

    console.log(
      `Widget [${currentWidget.title}] size changed to:`,
      currentWidget.sizeType
    );
  }
  widgetActionClickedChart(action: string) {
    const currentIndex = SIZE_ORDER.indexOf(this.sizeTypeChart);

    switch (action) {
      case 'Increase':
        if (currentIndex < SIZE_ORDER.length - 1) {
          this.sizeTypeChart = SIZE_ORDER[currentIndex + 1];
        }
        break;

      case 'Decrease':
        if (currentIndex > 0) {
          this.sizeTypeChart = SIZE_ORDER[currentIndex - 1];
        }
        break;

      case 'Collapse':
        this.sizeTypeChart = 'small';
        break;

      case 'FullViewWidget':
        this.sizeTypeChart = 'large-x';
        break;

      default:
        break;
    }

    console.log('Widget sizeTypeChart changed to:', this.sizeTypeChart);
  }

  selectedValues(event: any) {
    console.log(event);
  }

  infoAction(type: any) {
    console.log(type);
  }

  copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

 ngOnInit (): void {    
    this.service.wigetConfig().subscribe({
      next:(res: any)=>{
        this.widgetConfigOptions = res.widgetConfigurationOptions;
        this.widgetOutputEvents = res.widgetOutputEvents;
      },
      error:(error: any)=>{
      },
    })}
}
