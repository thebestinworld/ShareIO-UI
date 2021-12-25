import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

  content?: string;

  constructor(private userService: UserService, private eventBusService: EventBusService) { }

  ngOnInit(): void {
    this.userService.getUserBoard().subscribe({
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
