import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../_services/file.service';
import { UserService } from '../_services/user.service';
import { Location } from '@angular/common';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.css']
})
export class ShareFileComponent implements OnInit {

  users: any;
  fileName: any;
  shareUserForm = this.fb.group({
    userId: ''
  })

  constructor(private userService: UserService, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private fileService: FileService, private router: Router,
    private location: Location, private eventBusService: EventBusService) {
  }

  ngOnInit(): void {
    this.fileName = this.fileService.getCurrentFileName();
    this.getSelectedUser();
  }

  getSelectedUser(): void {
    this.userService.getUserForShare()
      .subscribe({next: (data) => {
        this.users = data;
        this.shareUserForm.controls['userId'].setValue(data[0].id);
      },
      error: (e) => {
        if (e.message === 'Refresh Token Expired') {
          this.eventBusService.emit(new EventData('logout', null));
          this.router.navigate(['/'])
        }
      }});
  }

  onSubmit(): void {
    const fileId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.shareFile(fileId, this.shareUserForm.value['userId']).subscribe({
      next: (data) => {
        this.router.navigate(['file/' + fileId])
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => console.info('File Shared Successfully')
    });
  }

  backClicked() {
    this.location.back();
  }
}
