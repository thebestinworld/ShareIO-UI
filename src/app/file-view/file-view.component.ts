import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FileDTO } from '../_models/file';
import { FileService } from '../_services/file.service';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {

  file!: FileDTO;
  image: any
  constructor(private fileService: FileService, private activatedRoute: ActivatedRoute, 
              private route: Router, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.getFile(id).subscribe(data => { 
      this.file = data 
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.file.encodedData}`);
    });
    
  }

  updateFile(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.setFile(this.file);
    this.route.navigate(['file/'+  id +'/update'])
  }

  shareFile(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.setFile(this.file);
    this.route.navigate(['file/'+  id +'/share'])
  }

  deleteFile(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.deleteFile(id).subscribe( {
        next: (data) => {
          this.route.navigate(['/file'])
        },
      });  
   
  }
}
