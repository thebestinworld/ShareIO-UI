import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ReminderService } from '../_services/reminder.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reminder-create',
  templateUrl: './reminder-create.component.html',
  styleUrls: ['./reminder-create.component.css']
})
export class ReminderCreateComponent implements OnInit, AfterViewInit {

  @ViewChild('picker') picker: any;
  public minDate = new Date();
  public maxDate!: Date;
  public color: ThemePalette = 'primary';
  public dateControl = new FormControl(null);

  fileUploadForm = this.formBuilder.group({
    message: '',
    time: this.dateControl
  });
  
  constructor(private formBuilder: FormBuilder, private reminderService: ReminderService, private router: Router,  
    private location: Location) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  onSubmit(): void {
    const datepipe: DatePipe = new DatePipe('en-US')
    let formattedDate = datepipe.transform(this.fileUploadForm.controls['time'].value, 'YYYY-MM-dd HH:mm')
    this.reminderService.create(this.fileUploadForm.controls['message'].value, formattedDate).subscribe({
      next: (data) => {
        this.router.navigate(['reminder']);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  backClicked() {
    this.location.back();
  }
}
