import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RevertService } from '../_services/revert.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-revert',
  templateUrl: './revert.component.html',
  styleUrls: ['./revert.component.css']
})
export class RevertComponent implements OnInit {
  selectedValue = 0;
  versions: any;
  versionForm = this.fb.group({
    version: ''
  })


  constructor(private revertService: RevertService, private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.getAvailableVersions();
  }

  getAvailableVersions(): void {
    const fileId = this.activatedRoute.snapshot.paramMap.get('id');
    this.revertService.getFileVersions(fileId)
      .subscribe(data => {
        if (!data.length) {
          this.versionForm.controls['version'].disable()
        } else {
          this.versions = data;
          this.versionForm.controls['version'].setValue(data[0]);
        }

      });
  }

  onSubmit(): void {
    const fileId = this.activatedRoute.snapshot.paramMap.get('id');
    this.revertService.revertFile(fileId, this.versionForm.value['version']).subscribe({
      next: (data) => {
        this.router.navigate(['file/' + fileId])
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => console.info('File Was Reverted Successfully')
    });
  }

  backClicked() {
    this.location.back();
  }
}
