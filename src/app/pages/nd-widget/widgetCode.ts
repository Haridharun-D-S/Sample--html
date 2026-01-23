export const htmlWidgetCode = `<div [ngClass]="{
              'col-lg-12 col-md-12 col-sm-12 dl-12':size == 'large-x',
              'col-lg-9 col-md-9 col-sm-9': size == 'large',
              'col-lg-6 col-md-6 col-sm-6 dl-6': size == 'medium',
              'col-lg-4 col-md-4 col-sm-4 dl-4': size == 'small',
            }" id="{{uniqueId}}">
    <div class="tile-card">
        <div class="tile-header">
            <div class="tile-title">
                <span>
                    <i class="fa fa-dashboard"></i>
                    <span class="title-text" [title]="title">{{ title }}</span>
                </span>
                <span class="icon-rep ms-1" title="{{titleIdentification}}">
                    <i class="fa fa-user"></i>
                </span>
            </div>

            <div class="tile-actions">
                <div class="col pl-0 dash-controls dis-fl">
                    <a class="dash-controls-icons dis-fl">
                        <span class="show-controls" title="More"><i class="fa fa-angle-left fn-bld"></i></span>
                        <span class="hide-controls" title="Less"><i class="fa fa-angle-right fn-bld"></i></span>
                        <span class="dash-controls-icons-hover">
                            <ul>
                                <li (click)="onWidgetControlClicked('Increase')" title="Increase Width">
                                    <span><i class="fa fa-expand"></i></span>
                                </li>
                                <li (click)="onWidgetControlClicked('Decrease')" title="Decrease Width">
                                    <span><i class="fa fa-compress"></i></span>
                                </li>
                                <li (click)="onWidgetControlClicked('Collapse')" title="Collapse">
                                    <span><i class="fa fa-minus"></i></span>
                                </li>
                            </ul>
                        </span>
                    </a>
                    <a class="dash-controls-icons-nt" (click)="onWidgetControlClicked('DragAndDrop')">
                        <span class="example-handle" title="Drag & Drop" cdkDragHandle>
                            <i class="fa fa-arrows"></i>
                        </span>
                    </a>
                    <a (click)="onWidgetControlClicked('FullViewWidget')" class="dash-controls-icons-nt">
                        <span title="Full View Widget"><i class="fa fa-external-link fn-bld"></i></span>
                    </a>
                </div>
            </div>
        </div>
        <div>
            <div *ngIf="widgetFilterBar" style="display: inline-flex;"
                [style.display]="widgetFilterBar ? 'none' : 'inline-flex'"
                class="col btn-toolbar toolbar-h text-left edge pad-lft pad-rgt-rmv" role="toolbar">
                <div class="col" class="col default res-padding-0-lg dat-drp filter-align pad-rgt-rmv pad-col-4">
                    <span>
                        <span *ngIf="widgetFilterBarOptions.firstDropdownValue.show ?? true">
                            <i class="{{ widgetFilterBarOptions.firstDropdownValue.icon}}"></i>
                            <span class="org-col-4 mr-0 ng-binding">
                                <span class="dis">&nbsp;{{widgetFilterBarOptions.firstDropdownValue.label}}:</span>
                                &nbsp; <select
                                    (change)="onSelectChange($event, widgetFilterBarOptions.firstDropdownValue.label)">
                                    <option value="" disabled>Select an option</option>
                                    <option
                                        *ngFor="let opt of widgetFilterBarOptions.firstDropdownValue.dropdownOptions"
                                        [value]="opt.value">{{ opt.value }}</option>
                                </select>
                            </span>
                        </span>
                        <span *ngIf=" widgetFilterBarOptions.secondDropdownValue.show ?? true"
                            class="org-col-4 ng-binding" style="padding-left: 5px;">
                            <span class="dis la-res"><i
                                    class="{{widgetFilterBarOptions.secondDropdownValue.icon}}"></i>&nbsp;
                                {{widgetFilterBarOptions.secondDropdownValue.label}}:</span>
                            &nbsp; <select
                                (change)="onSelectChange($event, widgetFilterBarOptions.secondDropdownValue.label)">
                                <option value="" disabled>Select an option</option>
                                <option *ngFor="let opt of widgetFilterBarOptions.secondDropdownValue.dropdownOptions"
                                    [value]="opt.value">{{ opt.value }}</option>
                            </select>
                        </span>
                    </span>
                </div>
            </div>
            <div class="line-container">
                <span class="middle-line"></span>
            </div>
            <div *ngIf="infoActionGroup.default" style="display: inline-flex; justify-content: flex-end;"
                class="col-lg-12 col-md-12 col-sm-12 info-nova bord-info">
                <button *ngIf="infoActionGroup.showSave" [disabled]="infoActionGroup.disableSave"
                    (click)="onInfoAction('save')" class="btn btn-sapphire pull-right btn-round info-btn btn-chrt-save">
                    <i class="fa fa-floppy-o" style="margin-left:-5px" aria-hidden="true"></i>
                </button>
                <button *ngIf="infoActionGroup.showInfo" [disabled]="infoActionGroup.disableInfo"
                    (click)="onInfoAction('info')" class="btn btn-info pull-right btn-round info-btn ms-2 me-2">
                    <i class="fa fa-info" aria-hidden="true"></i>
                </button>
            </div>
            <div class="tile-body">
                <ng-content>
                </ng-content>
            </div>
        </div>
    </div>
</div>
`;

export const tsWidgetCode = `
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
`;
export const cssWidgetCode = `
.tile-card {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 300px;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    }

    .tile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 14px;
        border-bottom: 2px solid #e8c67c;
        gap: 8px;

        .tile-title {
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
            gap: 6px;
            font-size: 16px;
            color: #3a2d00;

            i {
                color: #b8860b;
                font-size: 18px;
            }

            span {
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 20px;
            }
        }

        .tile-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;

            .icon-btn {
                border: none;
                background: transparent;
                cursor: pointer;
                padding: 4px;
                border-radius: 50%;

                &:hover {
                    background: #f5f5f5;
                }

                i {
                    font-size: 16px;
                }

                &.user i {
                    color: #3b82f6; // blue
                }

                &.save i {
                    color: #9e9e9e;
                }

                &.info i {
                    color: #f97316;
                }
            }
        }
    }

    .tile-body {
        flex: 1;
        padding: 16px;
        background: #fafafa;
    }
}


.icon-rep {
    width: 22px;
    height: 22px;
    background: #4285f4;
    border: 2px solid #4285f4;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: white;
    line-height: 1;
    padding: 0;
    vertical-align: middle;
}

.icon-rep .fa {
    font-size: 11px !important;
    color: #fff !important;
}

.dis-fl {
    display: inline-flex !important;
}

.dash-controls .dash-controls-icons .hide-controls {
    display: none;
}

.dash-controls .dash-controls-icons:hover .hide-controls {
    display: inline-flex;
}

.dash-controls .dash-controls-icons:hover .show-controls {
    display: none;
}

.dash-controls .dash-controls-icons .fa,
.dash-controls .dash-controls-icons .fas {
    color: #9e9e9e;
}

.dash-controls .dash-controls-icons .dash-controls-icons-hover {
    max-width: 0;
    transition: max-width 1s;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    overflow: hidden;
}

.dash-controls .dash-controls-icons-nt .fa,
.dash-controls .dash-controls-icons-nt .fas {
    color: #9e9e9e;
    padding-right: 2px;
}

.dash-controls .dash-controls-icons-nt .fn-bld {
    font-weight: 600;
}

.dash-controls {
    padding: 0px;
    position: relative;
    z-index: 100;
    display: block;
    font-size: 13px;
    padding-top: 4px !important;
    float: right;
    right: 0px;
    top: 0px;
    text-align: right;
    justify-content: right;

    .dash-controls-icons-nt {
        padding-left: 8px;

        .fa,
        .fas {
            color: #9e9e9e;
        }

        .fn-bld {
            font-weight: 600;
        }
    }

    .dash-controls-icons {
        padding-left: 8px;

        .fa,
        .fas {
            color: #9e9e9e;
        }

        .fn-bld {
            font-weight: 600;
        }

        .dash-controls-icons-hover {
            ul {
                padding-left: 0px !important;
                margin-bottom: 0px !important;
            }

            li {
                list-style: none;
                display: inline-block;
                padding-left: 8px;
                margin-bottom: 0px !important;
            }
        }

        .show-controls {
            display: block;
        }

        .hide-controls {
            display: none;
        }
    }

    .dash-controls-icons .dash-controls-icons-hover {
        max-width: 0;
        -webkit-transition: max-width 1s;
        transition: max-width 1s;
        display: inline-block;
        vertical-align: top;
        white-space: nowrap;
        overflow: hidden;
    }

    .dash-controls-icons:hover .dash-controls-icons-hover {
        max-width: 10rem;
    }

    .dash-controls-icons:hover .show-controls {
        display: none;
    }

    .dash-controls-icons:hover .hide-controls {
        display: block;
    }
}

.full-width-sidemenu {
    .sidebar-list-container {
        top: 75px !important;
    }

    .content-container {
        padding-top: 40px !important;
    }
}

a,
a img,
button,
.btn {
    cursor: pointer;
}

.title-text {
    flex: 1;
    min-width: 0;
    /* REQUIRED for ellipsis */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    /* block or inline-block is needed */
    font-weight: 500;
}




// timer

.dl-6 .dat-drp.filter-align.pad-rgt-rmv.pad-col-4 {
    padding: 0px;
}

.dashboard article .dat-drp span select {
    height: 25px;
    background-color: #f5f5f5;
    color: #000;
    border-color: #fff;
    width: 160px;
    font-size: 11px !important;

}


select {
    padding: 2px;
    border-radius: 4px;
    height: 25px;
    background-color: #f5f5f5;
    color: #000;
    border-color: #fff;
    width: 160px;
    padding-right: 4px;
    padding-left: 4px;
    font-size: 11px !important;
}

.dat-drp select:focus {
    outline: #aed498 auto 1px !important;
}

.default {
    display: flex;
    justify-content: center;
    margin-top: 7px;
    align-items: center;
}

.line-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 10px;
    position: relative;
}

.middle-line {
    width: 97%;
    height: 0.5px;
    background-color: #eeeeee;
    border-radius: 2px;
}

// info icon
.dashboard .info-nova {
    padding-top: 5px !important;
    padding-left: 9px !important;
}



.info-nova .btn:not(.btn-icon),
.info-nova .input-group .input-group-btn .btn,
.info-nova .btn-sm:not(.btn-icon),
.info-nova .input-group.input-group-sm .input-group-btn .btn {
    height: 20px;
    width: 20px;
    padding: 1px 8px 10px 7px;
    outline: none;
}

.dashboard .btn {
    margin-bottom: 0px;
}

.info-nova .btn-info {
    color: #fff !important;
    background-color: #ef7b2e !important;
    border-color: #AD7A0F !important;
}

.btn.btn-round {
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
}

.btn.disabled,
.btn:disabled,
fieldset:disabled .btn {
    border-color: transparent !important;
    cursor: not-allowed !important;
}
`;
