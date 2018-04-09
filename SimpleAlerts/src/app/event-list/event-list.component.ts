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

  constructor(private messageService: MessageService) {
    // Subscribe to Dashboard component events //
    this.messageService.subscribeToEvent().subscribe(event => {
      if (this.eventTypes.includes(event.type)) {
        this.eventList.push(new Event(event));
      } else {
        console.log('Event type not part of this component');
      }
    });
  }

  ngOnInit() {
    // Setup checkboxes for selection before listening for events //
    // Need to create a deletion event //
  }
}
