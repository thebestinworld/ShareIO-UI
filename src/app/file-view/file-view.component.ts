import { JsonpClientBackend } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FileDTO } from '../_models/file';
import { FileService } from '../_services/file.service';
import { Location } from '@angular/common';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit, AfterViewInit {

  file!: FileDTO;
  image: any
  audio: any;
  video: any;
  text: any;
  showShare = false;
  showDelete = false;

  @ViewChild('audioContainer', { static: true }) audioContainer: any;
  @ViewChild('videoContainer', { static: true }) videoContainer: any;

  constructor(private fileService: FileService, private tokenService: TokenStorageService, private activatedRoute: ActivatedRoute,
    private route: Router, private sanitizer: DomSanitizer, private location: Location) {
  }

  ngAfterViewInit(): void {
    this.audioContainer?.nativeElement.load();
    this.videoContainer?.nativeElement.load();
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.getFile(id).subscribe(data => {
      this.file = data
      this.showShare = this.file.uploaderId === this.tokenService.getUser().id
      this.showDelete = this.file.uploaderId === this.tokenService.getUser().id;
      /*Handle image*/
      if (this.file.extension === 'png') {
        this.image = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.file.encodedData}`);
      }
      if (this.file.extension === 'jpeg') {
        this.image = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64, ${this.file.encodedData}`);
      }
      /*Handle audio*/
      if (this.file.extension === 'mp3') {
        this.audio = this.sanitizer.bypassSecurityTrustResourceUrl(`data:audio/mp3;base64, ${this.file.encodedData}`);
      }
      if (this.file.extension === 'wav') {
        this.audio = this.sanitizer.bypassSecurityTrustResourceUrl(`data:audio/wav;base64, ${this.file.encodedData}`);
      }
      /*Handle video*/
      if (this.file.extension === 'mp4') {
        this.video = this.sanitizer.bypassSecurityTrustResourceUrl(`data:video/mp4;base64, ${this.file.encodedData}`);
      }
      if (this.file.extension === 'webm') {
        this.video = this.sanitizer.bypassSecurityTrustResourceUrl(`data:video/webm;base64, ${this.file.encodedData}`);
      }
    });
  }

  updateFile() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.setFile(this.file);
    this.route.navigate(['file/' + id + '/update'])
  }

  shareFile() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.setFile(this.file);
    this.route.navigate(['file/' + id + '/share'])
  }

  deleteFile(name: string) {
    if (confirm("Are you sure to delete this file " + name)) {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.fileService.deleteFile(id).subscribe({
        next: (data) => {
          this.route.navigate(['/file'])

        },
      });
    }
  }

  backClicked() {
    this.location.back();
  }
}
