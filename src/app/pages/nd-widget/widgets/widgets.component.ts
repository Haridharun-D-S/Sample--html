import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface DropdownOption {
  value: string;
  id?: string;
}

export interface DropdownField {
  label: string;
  show?: boolean;
  icon?: string;
  dropdownOptions?: DropdownOption[];
}

export interface WidgetFilterBarOptions {
  firstDropdownValue: DropdownField;
  secondDropdownValue: DropdownField;
}
export interface WidgetActionBarConfig {
  default: boolean;
  showSave: boolean;
  showInfo: boolean;
  disableSave: boolean;
  disableInfo: boolean;
}
@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
})
export class WidgetsComponent implements OnInit {
  // properties
  @Input() title: string = 'Title';
  @Input() uniqueId: string | number = 'Widget-1';
  @Input() titleIdentification: string = 'For Me';
  @Input() size: 'small' | 'medium' | 'large' | 'large-x' | string = 'medium';
  @Input() infoActionGroup: WidgetActionBarConfig = {
    default : true,
    showSave: true,
    showInfo: true,
    disableSave: false,
    disableInfo: false,

};
  @Input() widgetFilterBar: boolean = true;
  @Input() widgetFilterBarOptions: WidgetFilterBarOptions = {
    firstDropdownValue: {
      label: 'Time',
      show:true,
      dropdownOptions: [],
      icon:'fa fa-calendar-check-o'
    },
    secondDropdownValue: {
      label: 'Organization',
      dropdownOptions: [],
      show: true,
      icon:'fa fa-sitemap'
    }
  };

  // events
  @Output() widgetActionClicked = new EventEmitter();
  @Output() selectedItem = new EventEmitter();
  @Output() infoActionClicked= new EventEmitter();

  
  toggleLegend = true;
 
  ngOnInit(): void {
    //
    console.log(this.infoActionGroup);
    
  }

  ngOnChanges(_changes: SimpleChanges): void {
    //
  }


  onWidgetControlClicked(event: string) {
    this.widgetActionClicked.emit(event);
  }

  onSelectChange(event: any, label: string) {
    const selected = {
      label: label ?? null,
      value: event?.target?.value ?? null,
    };
    this.selectedItem.emit(selected);
  }

  onInfoAction(type: string){
    this.infoActionClicked.emit(type ?? null);
  }
}
