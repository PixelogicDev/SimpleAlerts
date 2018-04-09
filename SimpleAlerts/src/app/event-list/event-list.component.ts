import { Component, OnInit, Input } from '@angular/core';
import { Subscription as rxSubscription } from 'rxjs/Subscription';
import { MessageService } from '../services/message.service';

// Models //
// import { Follower } from '../shared/models/follower.model';
// import { Donation } from '../shared/models/donation.model';
// import { Subscription } from '../shared/models/subscription.model';
// import { Cheer } from '../shared/models/cheer.model';
import { Event } from '../shared/models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  // Properties //
  @Input() eventTypes: Array<string>;
  title: string;
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
    this.title = 'New Event';
  }
}
