import { ILoadingOverlayAngularComp } from "@ag-grid-community/angular"
import { ILoadingOverlayParams } from "@ag-grid-community/core"
import { Component } from "@angular/core"

@Component({
  selector: 'app-custom-loading-overlay',
  standalone: true,
  templateUrl: './custom-loading-overlay.component.html',
  styleUrls: ['./custom-loading-overlay.component.scss']
})
export class CustomLoadingOverlayComponent implements ILoadingOverlayAngularComp {

   public params!: ILoadingOverlayParams & { loadingMessage: string }

  agInit(params: ILoadingOverlayParams & { loadingMessage: string }): void {
    this.params = params
  }

}
