import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../services/message.service';

// Models //
import { Follower } from '../shared/models/follower.model';
import { Donation } from '../shared/models/donation.model';
// import { Subscription } from '../shared/models/subscription.model';
import { Cheer } from '../shared/models/cheer.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  // Properties //
  eventType: string;
  subscription: Subscription;
  eventList = new Array<any>();

  constructor(private messageService: MessageService) {
    // Subscribe to Dashboard component //
    this.messageService.subscribeToEvent().subscribe(event => {
      console.log('Event Received: ' + event);
      this.eventList.push(event);
    });
  }

  ngOnInit() {}
}
