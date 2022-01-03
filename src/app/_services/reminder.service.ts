import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const REMINDER_API = 'http://localhost:8080/api/reminder';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(private http: HttpClient) { }

  create(message: string, time: any): Observable<any> {
    return this.http.post(REMINDER_API, {message, time}, httpOptions);
  }

  getReminders(): Observable<any> {
    return this.http.get(REMINDER_API);
  }

  deleteReminder(reminderId: any): Observable<any> {
    return this.http.delete(REMINDER_API + '/' + reminderId);
  }
}
