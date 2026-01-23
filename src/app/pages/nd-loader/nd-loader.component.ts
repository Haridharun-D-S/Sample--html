import { Component } from '@angular/core';
import { cssloaderCode, htmlloaderCode, tsloaderCode } from './loaderCode';
import { JsonService } from 'src/app/shared/service/service.service';
@Component({
  selector: 'app-nd-loader',
  templateUrl: './nd-loader.component.html',
  styleUrls: ['./nd-loader.component.scss']
})
export class NdLoaderComponent {
  htmlloaderCode = htmlloaderCode;
  cssloaderCode = cssloaderCode;
  tsloaderCode = tsloaderCode;
  loaderConfigOptions: any[] = [];
  copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
constructor( readonly service : JsonService) {}
 ngOnInit (): void {    
    this.service.loaderConfig().subscribe({
      next:(res: any)=>{
        this.loaderConfigOptions = res.loaderConfigOptions;
      },
      error:(error: any)=>{
      },
    })}
}
