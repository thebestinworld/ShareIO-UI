import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from '../_services/file-upload.service';
import { FileService } from '../_services/file.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

@Component({
  selector: 'app-file-data-upload',
  templateUrl: './file-data-upload.component.html',
  styleUrls: ['./file-data-upload.component.css']
})
export class FileDataUploadComponent implements OnInit {


  fileName = '';
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileId?: string;

  constructor(private fileUploadService: FileUploadService,
    private eventBusService: EventBusService,
    private fileService: FileService,
    private router: Router) { }

  ngOnInit(): void {
    this.fileUploadService.currentDetail.subscribe({
      next: (data) => {
        this.fileId = data;
      },
      error: (e) => {
      }
    });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  backClicked() {
    this.fileService.deleteFile(this.fileId).subscribe({
      next: (data) => {
        this.router.navigate(['/file'])

      },
    });
  }
  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.fileUploadService.uploadFileData(this.currentFile, this.fileId).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              setTimeout(() => {
                this.router.navigate(['/file']);
              }, 300);
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          });

      }
      this.selectedFiles = undefined;
    }
  }
}
