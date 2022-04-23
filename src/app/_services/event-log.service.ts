import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { EventLogList } from '../_interface/event-log';

const EVENT_LOG_API = 'http://localhost:8080/api/event_log';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventLogService {

  constructor(private http: HttpClient) { }

  getLogs(sort: string, order: SortDirection, page: number, size: number,
    id: number, timestamp: Date, userName: string, eventType: string, dynamicContent: string): Observable<any> {
    return this.http
      .post<EventLogList>(`${EVENT_LOG_API}`,
        { sort, order, page, size, id, timestamp, userName, eventType, dynamicContent },
        httpOptions
      );
  }
}
