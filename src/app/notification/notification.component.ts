import { Component, OnInit } from '@angular/core';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ModalService } from '../_modal';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  message! : string;
  disabled = true;
  private stompClient: any;
  constructor(private modalService: ModalService, private tokenStorageSerivce: TokenStorageService) { }

  ngOnInit(): void {
    const socket = new SockJS('http://localhost:8080/share-stomp-endpoint');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: string) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/notification', function (notification: { body: string; }) {
      _this.showNotification(JSON.parse(notification.body));
      });
    });
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;
    if (connected) {
        this.message = '';
    }
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }

  showNotification(notifcation: any) {
    var user = this.tokenStorageSerivce.getUser();
    /*Check if the notification is for the current user*/
    if (user.id === notifcation.userId) {
      var message = notifcation.message + ' ' + notifcation.userId;   
      this.message = message;
      this.modalService.open('custom-modal-1');
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
