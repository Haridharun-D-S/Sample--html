export const htmlfileuploadCode = `

<div
  class="file-upload-container"
  *ngIf="!isShowFileDetails"
  (dragover)="onDragOver($event)"
  (dragleave)="onDragLeave($event)"
  (drop)="onDrop($event)"
  [class.dragover]="isDragging"
>
  <div class="row m-0 justify-content-center text-center">

    <!-- Optional Upload Image -->
    <div class="col-12 text-center" *ngIf="config?.showImage">
      <img
        [src]="config?.imagePath || 'assets/images/File upload.png'"
        [alt]="config?.title || 'file-upload'"
        [height]="config?.imageHeight || 200"
      />
    </div>

    <!-- Upload Zone -->
    <div class="col-10 p-0 upload-file-line">
      <div class="upload-info">
        <span class="left-upload-cloud">
          <i class="fa fa-cloud-upload"></i>
        </span>

        <!-- Dynamic Title -->
        <p *ngIf="isFileValid; else invalidMsg">
          {{ config?.title || 'Upload File' }}
          <span *ngIf="config?.allowedTypes?.length">
            ({{ config?.allowedTypes?.join(', ') ?? '' }})
            <sup class="text-danger">*</sup>
          </span>
        </p>

        <!-- Invalid Message -->
        <ng-template #invalidMsg>
          <p style="color: #d32f2f;">
            Please upload valid file(s) ({{ config?.allowedTypes?.join(', ') }})
          </p>
        </ng-template>

        <!-- File Name(s) -->
        <div *ngIf="selectedFiles.length > 0" class="file-list">
          <p *ngFor="let file of selectedFiles">{{ file.name }}</p>
        </div>
      </div>

      <!-- Hidden File Input -->
      <input
        type="file"
        #fileInput
        class="d-none"
        [accept]="getAcceptedTypes()"
        [multiple]="config?.allowMultiple || false"
        (change)="onFileSelected($event)"
      />

      <!-- Buttons -->
      <div class="mt-2">
        <button class="btn btn-primary upl-btn" (click)="fileInput.click()">
          {{ config?.selectButtonLabel || 'Choose File' }}
        </button>

        <button
          class="btn btn-success upl-btn ms-2"
          [disabled]="selectedFiles.length === 0 || isUploading"
          (click)="uploadFiles()"
        >
          {{ isUploading ? 'Uploading...' : (config?.uploadButtonLabel || 'Upload') }}
        </button>
      </div>
    </div>
  </div>
</div>
`;
export const cssfileuploadCode = `


.file-upload-container {
  width: 100%;
  text-align: center;
 
  cursor: pointer;

 
}

.upload-file-line {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-upload-cloud {
  font-size: 40px;
  color: #2196f3;
}

.file-list {
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  width: 80%;
  text-align: center;

  p {
    margin: 0;
    font-size: 14px;
    color: #0d0d0d;
    word-break: break-all;
  }
}

.upl-btn {
  margin-top: 10px;
  min-width: 120px;
}
`;
export const tsfileuploadCode = `import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface FileUploadConfig {
  title?: string;
  allowedTypes?: string[];     // e.g., ['csv', 'xlsx', 'json']
  allowMultiple?: boolean;     // single/multiple file select
  showImage?: boolean;
  imagePath?: string;
  imageHeight?: number;
  selectButtonLabel?: string;
  uploadButtonLabel?: string;
  uploadUrl?: string;          // backend endpoint
}
@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent {
   @Input() config: FileUploadConfig = {
    title: 'Upload File',
    allowedTypes: ['csv', 'xlsx'],
    allowMultiple: false,
    showImage: true,
    uploadUrl: 'https://localhost:7240/api/FileUpload/BatchUpload'
  };

  @Output() fileUploaded = new EventEmitter<any>();

  isShowFileDetails = false;
  isFileValid = true;
  isDragging = false;
  isUploading = false;
  selectedFiles: File[] = [];

  /** Generate accept attribute dynamically */
  getAcceptedTypes(): string {
    return this.config.allowedTypes?.map(t => '.' + t).join(',') || '.csv';
  }

  /** Handle file selection */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = [];
    this.isFileValid = true;

    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.validateFiles(files);
    }
  }

  /** Handle drag over */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  /** Handle drag leave */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  /** Handle file drop */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length > 0) {
      this.validateFiles(files);
    }
  }

  /** Validate selected files */
  private validateFiles(files: File[]): void {
    const allowed = this.config.allowedTypes || [];
    const invalidFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return !allowed.includes(ext || '');
    });

    if (invalidFiles.length > 0) {
      this.isFileValid = false;
      this.selectedFiles = [];
    } else {
      this.isFileValid = true;
      this.selectedFiles = files;
    }
  }

  /** Upload selected files */
  async uploadFiles(): Promise<void> {
    if (this.selectedFiles.length === 0 || !this.isFileValid) return;

    this.isUploading = true;

    const formData = new FormData();
    this.selectedFiles.forEach((file, i) => {
   
    });

    try {
      const response = await fetch(this.config.uploadUrl || '', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        console.log(' Upload successful:', result);
        this.fileUploaded.emit(result);
      } else {
        console.error(' Upload failed:', response.status);
      }
    } catch (error) {
      console.error(' Upload error:', error);
    } finally {
      this.isUploading = false;
    }
  }
}`;