import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const NOTIFICATION_API = 'http://localhost:8080/api/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(userId: number): Observable<any> {
    return this.http.get(`${NOTIFICATION_API}`);
  }
}
