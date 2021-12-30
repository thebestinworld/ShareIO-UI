import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../_services/notification.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.css']
})
export class NotificationViewComponent implements OnInit {


  notifications?: Observable<any>;
  currentUser: any;

  constructor(private notificationService: NotificationService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.notifications = this.notificationService.getNotifications(this.currentUser.id);
  }

}
