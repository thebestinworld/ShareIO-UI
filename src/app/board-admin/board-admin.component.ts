import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';


@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;

  constructor(private userService: UserService, private eventBusService: EventBusService) { }

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe({
      next: (data) => {
        this.content = data;
      },
      error: (e) => {
        if (e.message === 'Refresh Token Expired') {
          this.eventBusService.emit(new EventData('logout', null));
        }
      }
    });
  }
}