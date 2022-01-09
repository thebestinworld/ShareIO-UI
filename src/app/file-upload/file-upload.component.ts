import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FileUploadService } from '../_services/file-upload.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { Location } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  fileUploadForm = this.formBuilder.group({
    name: '',
    description: ''
  });

  constructor(private formBuilder: FormBuilder, private fileUploadService: FileUploadService,
    private eventBusService: EventBusService, private router: Router, private location: Location) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.fileUploadService.upload(this.fileUploadForm.value).subscribe({
      next: (data) => {
        console.log(data)
        this.fileUploadService.setFileId(data.id)

      },
      error: (e) => {
        console.error(e)
      },
      complete: () => console.info('File upload Successful')
    });
    this.fileUploadForm.reset();
    this.router.navigate(['file/upload/data'])
  }
  backClicked() {
    this.location.back();
  }
}
