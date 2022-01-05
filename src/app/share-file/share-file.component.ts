import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../_services/file.service';
import { UserService } from '../_services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.css']
})
export class ShareFileComponent implements OnInit {

  users: any;
  shareUserForm = this.fb.group({
    userId: ''
  })

  constructor(private userService: UserService, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private fileService: FileService, private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.getSelectedUser();
  }

  getSelectedUser(): void {
    this.userService.getUserForShare()
      .subscribe(data => {
        this.users = data;
        this.shareUserForm.controls['userId'].setValue(data[0].id);
      });
  }

  onSubmit(): void {
    const fileId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fileService.shareFile(fileId, this.shareUserForm.value['userId']).subscribe({
      next: (data) => {
        console.log(data)
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
