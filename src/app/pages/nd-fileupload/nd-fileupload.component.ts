import { Component } from '@angular/core';
import { cssfileuploadCode, htmlfileuploadCode, tsfileuploadCode } from './fileupload/fileuploadCode';
import { FileUploadConfig } from './fileupload/fileupload.component';
@Component({
  selector: 'app-nd-fileupload',
  templateUrl: './nd-fileupload.component.html',
  styleUrls: ['./nd-fileupload.component.scss']
})
export class NdFileuploadComponent {
    html = htmlfileuploadCode;
    css = cssfileuploadCode;
    ts = tsfileuploadCode;
    copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
   singleFileConfig: FileUploadConfig = {
   
    allowedTypes: ['csv','png'],
    allowMultiple: true,
    selectButtonLabel: 'Select File',
    uploadButtonLabel: 'Upload'
  };
   onSingleFileUpload(files: File[]) {
    console.log('Single file uploaded:', files[0]?.name);
  }
}
