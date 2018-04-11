import { Component, OnInit, Input } from '@angular/core';
import { Subscription as rxSubscription } from 'rxjs/Subscription';
import { MessageService } from '../services/message.service';

import { Event } from '../shared/models/event.model';

// -- Filters -- //
import { Filter } from '../shared/models/filters/filter.model';

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

  constructor(private messageService: MessageService, private filter: Filter) {
    // Create new filter //
    this.filter = new Filter();

    // Subscribe to Dashboard component events //
    this.messageService.subscribeToEvent().subscribe(event => {
      console.log(`
        follows: ${this.follows}\n
        subs: ${this.subscriptions}\n
        cheers: ${this.cheers}\n
        donations: ${this.donations}
      `);

      if (this.follows && event.type === 'new_follower') {
        this.eventList.unshift(new Event(event));
      }

      if (this.subscriptions && event.type === 'new_subscription') {
        this.eventList.unshift(new Event(event));
      }

      if (this.cheers && event.type === 'new_cheer') {
        this.eventList.unshift(new Event(event));
      }

      if (this.donations && event.type === 'new_donation') {
        this.eventList.unshift(new Event(event));
      }

      if (this.filter.isActive) {
        // Run bump to top filter //
        if (this.filter.bumpThreshold !== 0) {
          this.eventList = this.filter.bumpToTop(this.eventList);
        }
      }
    });
  }

  ngOnInit() {}

  // -- Helpers -- //
  changedEvent(type: string) {
    if (type === 'follows') {
      this.follows = !this.follows;
    }

    if (type === 'subscriptions') {
      this.subscriptions = !this.subscriptions;
    }

    if (type === 'cheers') {
      this.cheers = !this.cheers;
    }

    if (type === 'donations') {
      this.donations = !this.donations;
    }
  }

  changeFilterValue(type: string, value: number) {
    if (type === 'follows') {
      if (value !== null) {
        this.filter.bumpThreshold = +value;
      }
    }
  }
}
