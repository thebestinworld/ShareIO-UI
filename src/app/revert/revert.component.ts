import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RevertService } from '../_services/revert.service';
import { Location } from '@angular/common';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

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
    private location: Location, private router: Router, private eventBusService: EventBusService) { }

  ngOnInit(): void {
    this.getAvailableVersions();
  }

  getAvailableVersions(): void {
    const fileId = this.activatedRoute.snapshot.paramMap.get('id');
    this.revertService.getFileVersions(fileId)
      .subscribe({next: (data) => {
        if (!data.length) {
          this.versionForm.controls['version'].disable()
        } else {
          this.versions = data;
          this.versionForm.controls['version'].setValue(data[0]);
        }

      },
      error: (e) =>{
        if (e.message === 'Refresh Token Expired') {
          this.eventBusService.emit(new EventData('logout', null));
          this.router.navigate(['/'])
        }
      }});
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
