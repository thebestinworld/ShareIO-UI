import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { EventLogService } from '../_services/event-log.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.css']
})
export class EventLogComponent implements OnInit, AfterViewInit {

  logs?: Observable<any>;
  currentUser: any;

  public minDate!: Date;
  public maxDate!: Date;
  public color: ThemePalette = 'primary';

  displayedColumns: string[] = ['id', 'timestamp', 'userName', 'event', 'eventMessage', 'dynamicContent'];
  data: Notification[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  idFilter = new FormControl('');
  timestampFilter = new FormControl('');
  userNameFilter = new FormControl('');
  eventFilter = new FormControl('');
  dynamicContentFilter = new FormControl('');

  filterValues: any = {
    id: '',
    timestamp: '',
    userName: '',
    event: '',
    dynamicContent: ''
  }

  constructor(private eventLogService: EventLogService, private token: TokenStorageService, 
    private eventBusService: EventBusService, private router: Router) { }
 
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
    this.timestampFilter.valueChanges
      .subscribe(
        timestamp => {
          const datepipe: DatePipe = new DatePipe('en-US')
          let formattedDate = datepipe.transform(timestamp, 'YYYY-MM-dd HH:mm')
          this.filterValues.timestamp = formattedDate;
        }
      )
    this.userNameFilter.valueChanges
      .subscribe(
        userName => {
          this.filterValues.userName = userName;
        }
      )

    this.eventFilter.valueChanges
      .subscribe(
        event => {
          this.filterValues.event = event;
        }
      )
    this.dynamicContentFilter.valueChanges
      .subscribe(
        dynamicContent => {
          this.filterValues.dynamicContent = dynamicContent;
        }
      )


    merge(this.sort.sortChange,
      this.idFilter.valueChanges,
      this.timestampFilter.valueChanges,
      this.userNameFilter.valueChanges,
      this.eventFilter.valueChanges,
      this.dynamicContentFilter.valueChanges,
      this.paginator.page
    ).pipe(
      startWith({}),

      switchMap(() => {
        return this.eventLogService!.getLogs(this.sort.active,
          this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValues.id,
          this.filterValues.timestamp,
          this.filterValues.userName,
          this.filterValues.event,
          this.filterValues.dynamicContent)
          .pipe( catchError((err, caught) => {
            if (err.message === 'Refresh Token Expired') {
              this.eventBusService.emit(new EventData('logout', null));
              this.router.navigate(['/'])
            }
            return caught;
          }));
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
    this.timestampFilter.setValue('');
    this.userNameFilter.setValue('');
    this.dynamicContentFilter.setValue('');
  }

}
