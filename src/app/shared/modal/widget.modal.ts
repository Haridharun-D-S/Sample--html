import { WidgetSettings } from './widgetsettings.modal'
import { EcareSimpleGridSettings } from './gridsettings.modal'
import { GeneralGridSettings } from './generalGrid.modal'

export class Widget {
    id: string
    type: string = ''
    data;
    settings: WidgetSettings;
    location?: string
    chartName?: string

}
export class Widget1 {
    id: string
    type: string = ''
    data;
    settings: EcareSimpleGridSettings
    location?: string
}

export class Widget2 {
    id: string
    type: string = ''
    data;
    settings: GeneralGridSettings
    location?: string
}
