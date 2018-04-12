import { Component, OnInit, Input } from '@angular/core';
import { Subscription as rxSubscription } from 'rxjs/Subscription';
import { MessageService } from '../services/message.service';

import { Event } from '../shared/models/event.model';

// -- Filters -- //
import { Filter } from '../shared/models/filters/filter.model';
import { SubFilter } from '../shared/models/filters/subFilter.model';
import { AmountFilter } from '../shared/models/filters/amountFilter.model';

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

      this.eventList = this.filter.runFilters(this.eventList);
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

      if (this.subscriptions) {
        this.filter.subscriptionFilter = new SubFilter();

        // Set filterByMonth to true for testing; this should be set on the UI //
        // this.filter.subscriptionFilter.filterByMonths = true;
        // this.filter.subscriptionFilter.filterBySubPlan = true;
      } else {
        this.filter.subscriptionFilter = null;
      }
    }

    if (type === 'cheers') {
      this.cheers = !this.cheers;

      if (this.cheers) {
        if (this.filter.amountFilter !== null) {
          console.log('Amount filter already here.');
        } else {
          this.filter.amountFilter = new AmountFilter();
        }

        // this.filter.amountFilter.filterByAmount = true;
      } else {
        if (!this.donations) {
          this.filter.amountFilter = null;
        }
      }
    }

    if (type === 'donations') {
      this.donations = !this.donations;

      if (this.donations) {
        if (this.filter.amountFilter !== null) {
          console.log('Amount filter already here.');
        } else {
          this.filter.amountFilter = new AmountFilter();
        }
      } else {
        if (!this.cheers) {
          this.filter.amountFilter = null;
        }
      }
    }
  }

  changeFilterValue(type: string, value: number) {
    if (type === 'follows') {
      if (value !== null) {
        this.filter.bumpThreshold = +value;
      }
    }
  }

  // MAD PROPS BarneyRubbble //
  eventRead(id: string) {
    console.log(`Did read: ${id}`);
    let foundEvent: Event;
    let eventIndex: number;

    foundEvent = this.eventList.find((event, index) => {
      eventIndex = index;
      return event.id === id;
    });

    if (foundEvent !== undefined) {
      console.log('Did find event, changing properties.');
      foundEvent.didRead = true;

      // Remove current event from array //
      this.eventList.splice(eventIndex, 1);

      // Push updated property to bottom of list //
      this.eventList.push(foundEvent);
      console.log('Property changed.');
    } else {
      console.log('Could not find event.');
    }
  }
}
