import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { ReminderService } from '../_services/reminder.service';
import { Reminder, ReminderList } from '../_interface/reminder';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit, AfterViewInit {

  reminders?: Observable<any>;

  public minDate!: Date;
  public maxDate!: Date;
  public color: ThemePalette = 'primary';

  displayedColumns: string[] = ['id', 'message', 'time', 'pastDue', 'deleteAction'];
  data: Reminder[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  idFilter = new FormControl('');
  messageFilter = new FormControl('');
  timeFilter = new FormControl('');
  pastDueFilter = new FormControl('');

  filterValues: any = {
    id: '',
    message: '',
    time: '',
    pastDue: ''
  }

  constructor(private reminderService: ReminderService, private router: Router) { }

  ngOnInit(): void {
  }

  deleteReminder(reminderId: any) {
    if (confirm("Are you sure to delete reminder with id: " + reminderId)) {
      this.reminderService.deleteReminder(reminderId).subscribe({
        next: (data) => {
          window.location.reload();
        },
      });
    }

  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.idFilter.valueChanges
      .subscribe(
        id => {
          this.filterValues.id = id;
        }
      )
    this.messageFilter.valueChanges
      .subscribe(
        message => {
          this.filterValues.message = message;
        }
      )
    this.timeFilter.valueChanges
      .subscribe(
        time => {
          const datepipe: DatePipe = new DatePipe('en-US')
          let formattedDate = datepipe.transform(time, 'YYYY-MM-dd HH:mm')
          console.log(formattedDate)
          this.filterValues.time = formattedDate;

        }
      )

    this.pastDueFilter.valueChanges
      .subscribe(
        pastDue => {
          this.filterValues.originalFileName = pastDue;
        }
      )


    merge(this.sort.sortChange,
      this.idFilter.valueChanges,
      this.messageFilter.valueChanges,
      this.timeFilter.valueChanges,
      this.pastDueFilter.valueChanges,
      this.paginator.page
    ).pipe(
      startWith({}),
      switchMap(() => {
        return this.reminderService!.getReminders(this.sort.active,
          this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValues.id,
          this.filterValues.message,
          this.filterValues.time,
          this.filterValues.pastDue)
          .pipe(catchError(() => of(null)));
      }),
      map(data => {
        if (data === null) {
          return [];
        }
        this.resultsLength = data.totalCount;
        return data.items;
      })
    ).subscribe(data => this.data = data);
  }

  clearFilter() {
    this.idFilter.setValue('');
    this.messageFilter.setValue('');
    this.timeFilter.setValue('');
    this.pastDueFilter.setValue('');
  }
}
