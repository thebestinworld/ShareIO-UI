import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ReminderService } from '../_services/reminder.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {

  reminders?: Observable<any>;
  
  constructor(private reminderService: ReminderService, private router: Router) { }

  ngOnInit(): void {
    this.reminders = this.reminderService.getReminders();
  }

  deleteReminder(reminderId: any) {
    this.reminderService.deleteReminder(reminderId).subscribe( {
      next: (data) => {
        window.location.reload();
      },
    });
  }
}
