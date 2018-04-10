import { Component, OnInit, Input } from '@angular/core';
import { Subscription as rxSubscription } from 'rxjs/Subscription';
import { MessageService } from '../services/message.service';

import { Event } from '../shared/models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  // Properties //
  @Input() title: string;
  eventTypes: Array<string>;
  subscription: rxSubscription;
  eventList = new Array<Event>();
  follows: Boolean = false;
  subscriptions: Boolean = false;
  cheers: Boolean = false;
  donations: Boolean = false;

  constructor(private messageService: MessageService) {
    // Subscribe to Dashboard component events //
    this.messageService.subscribeToEvent().subscribe(event => {
      if (event.type === 'new_follower' && this.follows) {
        this.eventList.push(new Event(event));
      }

      if (event.type === 'new_subscription' && this.subscriptions) {
        this.eventList.push(new Event(event));
      }

      if (event.type === 'new_cheer' && this.cheers) {
        this.eventList.push(new Event(event));
      }

      if (event.type === 'new_donation' && this.donations) {
        this.eventList.push(new Event(event));
      }
    });
  }

  ngOnInit() {
    // Setup checkboxes for selection before listening for events //
    // Need to create a deletion event //
  }
}
