import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { NotificationList } from '../_interface/notification';


const NOTIFICATION_API = 'http://localhost:8080/api/notification';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(sort: string, order: SortDirection, page: number, size: number,
    id: number, message: string, receivedDate: Date, isRead: string): Observable<any> {
    return this.http
      .post<NotificationList>(`${NOTIFICATION_API}/all`, { sort, order, page, size, id, message, receivedDate, isRead }, httpOptions);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(NOTIFICATION_API + '/' + id + '/mark-as-read', {}, httpOptions);
  }
}
