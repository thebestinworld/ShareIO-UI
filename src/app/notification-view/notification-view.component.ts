import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { NotificationService } from '../_services/notification.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.css']
})
export class NotificationViewComponent implements OnInit, AfterViewInit {


  notifications?: Observable<any>;
  currentUser: any;

  public minDate!: Date;
  public maxDate!: Date;
  public color: ThemePalette = 'primary';

  displayedColumns: string[] = ['id', 'message', 'receivedDate', 'isRead', 'markAsRead'];
  data: Notification[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  idFilter = new FormControl('');
  messageFilter = new FormControl('');
  receivedDateFilter = new FormControl('');
  isReadFilter = new FormControl('');

  filterValues: any = {
    id: '',
    message: '',
    receivedDate: '',
    isRead: ''
  }

  constructor(private notificationService: NotificationService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
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
    this.receivedDateFilter.valueChanges
      .subscribe(
        receivedDate => {
          const datepipe: DatePipe = new DatePipe('en-US')
          let formattedDate = datepipe.transform(receivedDate, 'YYYY-MM-dd HH:mm')
          this.filterValues.receivedDate = formattedDate;
        }
      )

    this.isReadFilter.valueChanges
      .subscribe(
        isRead => {
          this.filterValues.isRead = isRead;
        }
      )


    merge(this.sort.sortChange,
      this.idFilter.valueChanges,
      this.messageFilter.valueChanges,
      this.receivedDateFilter.valueChanges,
      this.isReadFilter.valueChanges,
      this.paginator.page
    ).pipe(
      startWith({}),
      switchMap(() => {
        return this.notificationService!.getNotifications(this.sort.active,
          this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValues.id,
          this.filterValues.message,
          this.filterValues.receivedDate,
          this.filterValues.isRead)
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
    this.receivedDateFilter.setValue('');
    this.isReadFilter.setValue('');
  }

  markAsRead(id: any) {
    this.notificationService!.markAsRead(id).subscribe({
      next: (data) => {
        window.location.reload();
      },
      error: (error) => {
        window.location.reload();
      }
    });
  }
}
