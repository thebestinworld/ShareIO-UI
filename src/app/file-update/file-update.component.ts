import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FileDTO } from '../_models/file';
import { FileService } from '../_services/file.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-file-update',
  templateUrl: './file-update.component.html',
  styleUrls: ['./file-update.component.css']
})
export class FileUpdateComponent implements OnInit {

  fileToUpdate?: FileDTO;
  fileUploadForm: any;
  selectedFile: any;

  constructor(private fileService: FileService, private formBuilder: FormBuilder, private router: Router, 
    private location: Location) { }

  ngOnInit(): void {
    this.fileService.currentDetail.subscribe({
      next: (data) => {
        this.fileToUpdate = data;
        this.fileUploadForm = this.formBuilder.group({
          name: data.name,
          description: data.description
        });
      },
      error: (e) => {
      }
    });
  }

  onSubmit(): void {
    this.fileService.updateFile(this.fileUploadForm.value, this.fileToUpdate?.id).subscribe({
      next: (data) => {
        console.log(data)
        if (this.selectedFile != null) {
          this.fileService.updateFileData(this.selectedFile, this.fileToUpdate?.id).subscribe({
            next: (data) => {
              setTimeout(() => {
                this.router.navigate(['file/' + this.fileToUpdate?.id])
              }, 100);
            },
            error: (e) => {
              console.log(e);
            }
          });
        } else {
          this.router.navigate(['file/' + this.fileToUpdate?.id])
        }
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => console.info('File Updated Successful')
    });
  }

  fileUpload(event: any) {
    this.selectedFile = event.target.files.item(0);
  }

  backClicked() {
    this.location.back();
  }
}
