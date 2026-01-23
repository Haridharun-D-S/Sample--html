# ND Custom Grid

A powerful Angular wrapper for AG Grid Enterprise that provides enhanced functionality, simplified configuration, and additional features for building robust data grids in Angular applications.

## 🚀 Features

- **Multiple Row Models**: Support for Client-Side, Server-Side, Infinite, and Viewport row models
- **Export Capabilities**: Built-in CSV and Excel export functionality
- **Smart Tooltips**: Custom tooltip component with intelligent content display
- **Flexible Text Handling**: Configurable text wrapping, truncation, and full display modes
- **Advanced Filtering**: Comprehensive filtering with floating filters
- **Sorting & Pagination**: Full sorting and pagination support
- **Column Management**: Resizable, movable columns with sidebar configuration
- **Selection Modes**: Single and multiple row selection with checkbox support
- **Cell Editing**: Inline cell editing capabilities
- **Theme Support**: Multiple AG Grid themes (Alpine, Balham, Material, Quartz)
- **Event Handling**: Comprehensive event emission for all grid interactions
- **Responsive Design**: Auto-sizing and responsive column management

## 📦 Installation

```bash
npm install @novacisdigital/nd-custom-grid
```

## 🔧 Dependencies

This library requires the following peer dependencies:

```json
{
"ng-custom-grid": "^1.4.1"
}
```

## 🚀 Quick Start

### 1. Import the Module

```typescript
import { NdGridModule } from 'nd-custom-grid';

@NgModule({
  imports: [
    NdGridModule.forRoot('AG_GRID_LICENSE_KEY'),,
    // ... other modules
  ]
})
export class AppModule { }
```

### 2. Basic Usage

```typescript
import { Component } from '@angular/core';
import { ColDef } from 'nd-custom-grid';

@Component({
  selector: 'app-my-component',
  template: `
    <nd-custom-grid
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [pagination]="true"
      [paginationPageSize]="10"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="onSelectionChanged($event)">
    </nd-custom-grid>
  `
})
export class MyComponent {
  rowData = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' }
  ];

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'email', headerName: 'Email', width: 200 }
  ];

  onGridReady(event: any) {
    console.log('Grid is ready:', event);
  }

  onSelectionChanged(event: any) {
    console.log('Selection changed:', event);
  }
}
```

## 📋 Configuration Options

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rowData` | `any[]` | `[]` | Data to be displayed in the grid |
| `columnDefs` | `ColDef[]` | `[]` | Column definitions |
| `gridOptions` | `GridOptions` | `{}` | AG Grid options object |
| `defaultColDef` | `ColDef` | `{}` | Default column definition |
| `pagination` | `boolean` | `true` | Enable pagination |
| `paginationPageSize` | `number` | `10` | Number of rows per page |
| `paginationPageSizeSelector` | `number[]` | `[10, 20, 50]` | Available page size options |
| `rowSelection` | `'single' \| 'multiple'` | `'multiple'` | Row selection mode |
| `cellEditable` | `boolean` | `false` | Enable cell editing |
| `enableCheckbox` | `boolean` | `false` | Enable checkbox selection |
| `sortable` | `boolean` | `true` | Enable column sorting |
| `filter` | `boolean` | `true` | Enable filtering |
| `floatingFilter` | `boolean` | `true` | Enable floating filters |
| `sidebar` | `boolean` | `false` | Enable sidebar |
| `resizable` | `boolean` | `true` | Enable column resizing |
| `rowModelType` | `'clientSide' \| 'serverSide' \| 'infinite' \| 'viewport'` | `'clientSide'` | Row model type |
| `cellTextMode` | `'wrap' \| 'truncate' \| 'full'` | `'full'` | Text display mode |
| `headerCheckboxSelection` | `boolean` | `false` | Enable header checkbox selection |
| `disableRightClick` | `boolean` | `false` | Disable right-click context menu |
| `csvExport` | `boolean` | `false` | Enable CSV export |
| `excelExport` | `boolean` | `false` | Enable Excel export |
| `sizeToFit` | `boolean` | `false` | Auto-size columns to fit container |
| `setToolTip` | `boolean` | `true` | Enable tooltips |
| `serverData` | `any[]` | `[]` | Server-side data |
| `maxBlocksInCache` | `number` | `5` | Maximum blocks in cache (server/infinite) |
| `cacheBlockSize` | `number` | `100` | Cache block size (server/infinite) |
| `domLayout` | `'normal' \| 'autoHeight' \| 'print'` | `'normal'` | DOM layout mode |
| `theme` | `string` | `'ag-theme-alpine'` | AG Grid theme |
| `widthSet` | `CustomwidthSet[]` | `{}` | Custom Width |
| `setCustomValue` | `any` | `` | setCustomValue no action happen |
| `enablePivot` | `boolean` | `false` | Enable/Disable pivot |
| `enableRowGrouping` | `boolean` | `false` | Enable/Disable RowGrouping |
| `totalKey` | `string \| number` | `'total'` | Total count field path or fixed number |
| `sideBartoolPanels` | `any[]` | `['columns', 'filters']` | Set/customize sidebar ,enable sidebar true|
| `suppressFieldDotNotation` | `boolean` | `true` | If true, disables interpreting dot notation in column field names. For example, user.name will be treated as a literal string instead of a nested object lookup. |
| `animateRows` | `boolean` | `false` |Enables row animation when rows are added, removed, or reordered. Improves visual transition effects.  |
| `suppressFiltersToolPanel` | `boolean` | `true` |When true, disables the filters panel from appearing in the sidebar.  |
| `exportClass` | `string` | `btn btn-primary` | CSS class applied to the grid export button. Can be customized for styling. |
| `gridId` | `string` | `Default-Id` |Unique identifier for the grid instance. Useful when multiple grids exist on the same page.  |
| `blockLoadDebounceMillis` | `number` | `0` |Number of milliseconds to debounce row loading in server-side grids. Helps reduce frequent data requests when scrolling rapidly.  |
| `hyperlinkColumns` | `string` | `[]` | List of column fields that should render as hyperlinks. Only specified columns will use the hyperlink cellRenderer. |
| `hyperlinkColumnsLabel` | `string` | `'field'` | The property name in columnDefs used to match with hyperlinkColumns. Defaults to 'field'. |
| `serverSideStoreType` | `string` | `'full'` | Configures the server-side store type for server-side row models. Common values: 'full' (loads all rows at once), 'partial' (loads rows on demand). |
| `overlayLoadingTemplate` | `string` | `'Loading...'` | Configure loader template |
| `overlayNoRowsTemplate` | `string` | `'No Rows To Show'` | Configure no rows template  |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `gridReady` | `GridReadyEvent` | Fired when grid is ready |
| `gridInitialized` | `any` | Fired when grid is initialized |
| `firstDataRendered` | `FirstDataRenderedEvent` | Fired when first data is rendered |
| `cellSelected` | `any` | Fired when a cell is clicked |
| `cellDoubleClick` | `CellDoubleClickedEvent` | Fired when a cell is double-clicked |
| `selectedRowsChange` | `any[]` | Fired when row selection changes |
| `serverRequest` | `any` | Fired for server-side requests |
| `dataFetched` | `any[]` | Fired when data is fetched |
| `serverParamsChange` | `any` | Fired when server parameters change |
| `cellValueChanged` | `CellValueChangedEvent` | Fired when cell value changes |
| `selectionChanged` | `SelectionChangedEvent` | Fired when selection changes |
| `sortChanged` | `SortChangedEvent` | Fired when sorting changes |
| `columnMoved` | `ColumnMovedEvent` | Fired when column is moved |
| `columnResized` | `ColumnResizedEvent` | Fired when column is resized |
| `rowDataChanged` | `any` | Fired when row data changes |
| `viewportChanged` | `ViewportChangedEvent` | Fired when viewport changes |
| `paginationChanged` | `PaginationChangedEvent` | Fired when pagination changes |
| `getCustomValue` | `any` | Fired when click any cell with value of setCustomValue (optional) |
| `cellEditingStarted` | `any` |Event fired when a cell enters editing mode. |
| `columnVisibleChanged` | `ColumnVisibleEvent` |Fired when a column's visibility is changed (shown/hidden) |

## 🔄 Row Models

### Client-Side Row Model (Default)

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [rowModelType]="'clientSide'">
</nd-custom-grid>
```

### Server-Side Row Model

```typescript
<nd-custom-grid
  [rowData]="[]"
  [columnDefs]="columns"
  [rowModelType]="'serverSide'"
  (serverRequest)="handleServerRequest($event)">
</nd-custom-grid>

// In your component
handleServerRequest(event: any) {
  const { params, payload } = event;
  // Make API call with payload
  this.apiService.getData(payload).subscribe(data => {
    params.success({ rowData: data.rows, rowCount: data.total });
  });
}
```

### Infinite Row Model

```typescript
<nd-custom-grid
  [rowData]="[]"
  [columnDefs]="columns"
  [rowModelType]="'infinite'"
  [maxBlocksInCache]="5"
  [cacheBlockSize]="100"
  (serverRequest)="handleInfiniteRequest($event)">
</nd-custom-grid>

// In your component
handleInfiniteRequest(event: any) {
  const { params, payload } = event;
  // Make API call with payload
  this.apiService.getData(payload).subscribe(data => {
    // Call successCallback for infinite model
    params.successCallback(data, data.length);
  });
}
```

## 📊 Export Functionality

### CSV Export

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [csvExport]="true">
</nd-custom-grid>
```

### Excel Export

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [excelExport]="true">
</nd-custom-grid>
```

## 🎨 Text Display Modes

### Wrap Mode

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [cellTextMode]="'wrap'">
</nd-custom-grid>
```

### Truncate Mode

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [cellTextMode]="'truncate'">
</nd-custom-grid>
```

### Full Mode (Default)

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [cellTextMode]="'full'">
</nd-custom-grid>
```

## 🎯 Advanced Features

### Checkbox Selection

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [enableCheckbox]="true"
  [headerCheckboxSelection]="true"
  [rowSelection]="'multiple'"
  (selectedRowsChange)="onSelectionChange($event)">
</nd-custom-grid>
```

### Cell Editing

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [cellEditable]="true"
  (cellValueChanged)="onCellValueChanged($event)">
</nd-custom-grid>
```

### Sidebar Configuration

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [sidebar]="true"
  [filter]="true">
</nd-custom-grid>
```

### Custom Themes

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [theme]="'ag-theme-material'">
</nd-custom-grid>
```

Available themes:
- `ag-theme-alpine` (default)
- `ag-theme-balham`
- `ag-theme-material`
- `ag-theme-quartz`

## 🔧 Customization

### Custom Column Definitions

```typescript
const columnDefs: ColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    cellRenderer: (params: any) => `<strong>${params.value}</strong>`
  },
  {
    field: 'age',
    headerName: 'Age',
    width: 100,
    type: 'numericColumn',
    cellClass: 'age-cell'
  }
];
```

### Custom Grid Options

```typescript
const gridOptions = {
  suppressRowClickSelection: false,
  animateRows: true,
  rowHeight: 50,
  headerHeight: 40,
  suppressHorizontalScroll: false,
  enableCellTextSelection: true
};
```

## 📱 Responsive Design

### Auto-Size Columns

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [sizeToFit]="true">
</nd-custom-grid>
```

### Auto Height Layout

```typescript
<nd-custom-grid
  [rowData]="data"
  [columnDefs]="columns"
  [domLayout]="'autoHeight'">
</nd-custom-grid>
```

## 🛠️ Development

### Building the Library

```bash
ng build nd-custom-grid
```

### Running Tests

```bash
ng test nd-custom-grid
```

### Publishing

```bash
npm publish
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact:
- **Organization**: Novacis Digital

## 🔗 Related Links

- [AG Grid Documentation](https://docs.google.com/document/d/1GW7o2aPfsKRmd9YH_e0VtWHYsF_sckLRuf78j7iVSI4/edit?tab=t.0)

---

**Private by Novacis Digital** - This library is proprietary software owned by Novacis Digital, LLC. Unauthorized copying, distribution, or use of this software is strictly prohibited. 