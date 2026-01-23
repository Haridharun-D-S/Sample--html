import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CssFileViewerCode, HtmlFileViewerCode, TSFileViewerCode } from './fileviewerCode';

@Component({
  selector: 'app-nd-packages',
  templateUrl: './nd-packages.component.html',
  styleUrls: ['./nd-packages.component.scss'],
})
export class NdPackagesComponent {
  readmePathGrid = 'assets/docs/README_AGGRID.md';
  readmePathChart = 'assets/docs/README_CHARTS.md';
  readmePathViewer = 'assets/docs/README_VIEWER.md';
    html = HtmlFileViewerCode;
    css = CssFileViewerCode;
    ts = TSFileViewerCode;

    copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
   url ="https://morth.nic.in/sites/default/files/dd12-13_0.pdf";
   page = 1;
   docx = 'https://files.fm/down.php?i=sdymh2y6';
    jpg =
    'https://fastly.picsum.photos/id/1012/200/300.jpg?hmac=KU5TJQJkcv2lK_5lVNCie4evqxUOfFGp0Qsv2gQZo5k';
  tiff =
    'https://cors-anywhere.herokuapp.com/https://people.math.sc.edu/Burkardt/data/tif/mountain.tif';
  png =
    'https://w7.pngwing.com/pngs/527/655/png-transparent-stick-figure-powerpoint-animation-animated-film-microsoft-powerpoint-communication-skills-for-dummies-hand-sports-equipment-megaphone.png';
 
     onPdfProgress(event: any) {
    console.log('PDFProgressData:>>', event);
  }
  onPdfLoaded(event: any) {
    console.log('PDFDocumentProxy:>>', event);
  }
  onPdfError(event: any) {
    console.log('onPdfError:>>', event);
  }
 pagechange(data: any) {
    console.log('page change:>>', data);
    this.page = data;
  }

  getPage(data: any) {
    console.log('getPage:>>', data);
  }

  reset(data: any){
    console.log('reset_data:>>', data);
  }
  ontextLayerRendered(data: any){
    console.log('reset_data:>>', data);
  }
}
