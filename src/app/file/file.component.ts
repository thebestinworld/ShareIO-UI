import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileService } from '../_services/file.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {


  files?: Observable<any>;
  currentUser: any;

  constructor(private fileService: FileService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.files = this.fileService.getFiles(this.currentUser.id);
  }
}
