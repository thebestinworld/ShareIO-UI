import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ReminderList } from '../_interface/reminder';

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
    return this.http.post(REMINDER_API + '/create', { message, time }, httpOptions);
  }

  getReminders(sort: string, order: SortDirection, page: number, size: number,
    id: number, message: string, time: Date, pastDue: string): Observable<any> {
      console.log(pastDue)
    return this.http.post<ReminderList>(REMINDER_API, { sort, order, page, size, id, message, time, pastDue });
  }

  deleteReminder(reminderId: any): Observable<any> {
    return this.http.delete(REMINDER_API + '/' + reminderId);
  }
}
