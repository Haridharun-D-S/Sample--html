import { Component, EventEmitter, Input, Output } from '@angular/core';

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
      formData.append(`file${i + 1}`, file);
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
}