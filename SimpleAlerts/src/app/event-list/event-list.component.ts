import { Component, OnInit, Input } from '@angular/core';
import { Subscription as rxSubscription } from 'rxjs/Subscription';
import { MessageService } from '../services/message.service';

import { Event } from '../shared/models/event.model';
import { FollowerEventCellComponent } from '../event-cells/follower-event-cell/follower-event-cell.component';

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
  @Input() parent: any;
  @Input() id: string;
  @Input() title: string;
  @Input() filter: Filter;
  eventTypes: Array<string>;
  subscription: rxSubscription;
  eventList = new Array<Event>();
  follows: Boolean = false;
  subscriptions: Boolean = false;
  cheers: Boolean = false;
  donations: Boolean = false;
  isEdit: Boolean = false;

  // Edit Options //
  color = 'accent';
  bumpFilterVal: Number = 5;
  resubFilterVal: Number = 5;
  tierFilterVal: Number = 2;
  donationFilterVal: Number = 25;
  cheerFilterVal: Number = 1000;

  // All Filters //
  allFilterActive: Boolean = false;
  bumpFilterActive: Boolean = false;

  // Subscriptions Filters //
  resubFilterActive: Boolean = false;
  tierFilterActive: Boolean = false;

  // Donations & Cheers //
  donationsFilterActive: Boolean = false;
  cheerFilterActive: Boolean = false;

  constructor(private messageService: MessageService) {
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

  ngOnInit() {
    this.initList();
  }

  // -- Helpers -- //
  initList() {
    if (this.filter !== null) {
      console.log('Setting component props...');
      console.log(this.filter);
      console.log(this.filter.subscriptionFilter);
      console.log(this.filter.amountFilter);

      // General Component Val Props //
      this.bumpFilterVal = this.filter.bumpThreshold / 60000;
      this.resubFilterVal = this.filter.subscriptionFilter.monthsThreshold;
      this.tierFilterVal =
        this.filter.subscriptionFilter.subPlanThreshold / 1000;
      this.donationFilterVal = this.filter.amountFilter.donationThreshold;
      this.cheerFilterVal = this.filter.amountFilter.cheerThreshold;

      // General Componenet All Filters //
      this.allFilterActive = this.filter.isActive;
      this.bumpFilterActive = this.filter.bumpIsActive;

      // Subscription Filters //
      this.resubFilterActive = this.filter.subscriptionFilter.filterBySubPlan;
      this.tierFilterActive = this.filter.subscriptionFilter.filterByMonths;

      // Donations & Cheers //
      this.donationsFilterActive = this.filter.amountFilter.donationIsActive;
      this.cheerFilterActive = this.filter.amountFilter.cheerIsActive;

      // MAD PROPS natsu130 //
      setInterval(() => {
        console.log('Running filter...');
        if (this.eventList.length > 0) {
          this.eventList = this.filter.runFilters(this.eventList);
        } else {
          console.log('Event list is empty.');
        }
      }, 10000);

      console.log('Props set.');
    } else {
      console.log('Filter is null. Nothing has changed.');
    }
  }

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

  // -- Edit Helpers -- //
  filtersChanged(event, type) {
    if (type === 'allFilter') {
      console.log('allFilterChanged is toggled...');
      if (event.checked) {
        console.log('Turning all filters on...');

        // Activate Filter //
        this.filter.isActive = true;
        this.allFilterActive = true;
        this.bumpFilterActive = true;

        // Go through each filter and activate them as well //
        this.filter.enableAllFilters();
        if (this.subscriptions) {
          this.resubFilterActive = true;
          this.tierFilterActive = true;
        }

        if (this.donations) {
          this.donationsFilterActive = true;
        }

        if (this.cheers) {
          this.cheerFilterActive = true;
        }

        console.log('Filters activated.');
      } else {
        console.log('Turning all filters off...');
        this.filter.isActive = false;
        this.allFilterActive = false;
        this.bumpFilterActive = false;

        if (this.subscriptions) {
          this.resubFilterActive = false;
          this.tierFilterActive = false;
        }

        if (this.donations) {
          this.donationsFilterActive = false;
        }

        if (this.cheers) {
          this.cheerFilterActive = false;
        }

        console.log('Filter deactivatd.');
      }
    }

    if (type === 'bumpFilter') {
      console.log('bumpFilter is toggled...');
      if (event.checked) {
        console.log('Turning bump filter on...');
        this.filter.bumpIsActive = true;
        this.bumpFilterActive = true;
      } else {
        console.log('Turning bump filter off...');
        this.filter.bumpIsActive = false;
        this.bumpFilterActive = false;
      }
    }

    if (type === 'resubFilter') {
      console.log('resubFilter is toggled...');
      if (event.checked) {
        console.log('Turning resub filter on...');
        this.filter.subscriptionFilter.filterByMonths = true;
        this.resubFilterActive = true;
      } else {
        console.log('Turning resub filter off...');
        this.filter.subscriptionFilter.filterByMonths = false;
        this.resubFilterActive = false;
      }
    }

    if (type === 'tierFilter') {
      console.log('tierFiler is toggled...');
      if (event.checked) {
        console.log('Turning tier filter on...');
        this.filter.subscriptionFilter.filterBySubPlan = true;
        this.tierFilterActive = true;
      } else {
        console.log('Turning tier filter off...');
        this.filter.subscriptionFilter.filterBySubPlan = false;
        this.tierFilterActive = false;
      }
    }

    if (type === 'donationFilter') {
      console.log('donationFilter is toggled...');
      if (event.checked) {
        console.log('Turning donations filter on...');
        this.filter.amountFilter.filterByAmount = true;
        this.filter.amountFilter.donationIsActive = true;
        this.donationsFilterActive = true;
      } else {
        console.log('Turning donations filter off...');
        if (!this.cheerFilterActive) {
          this.filter.amountFilter.filterByAmount = false;
        }

        this.filter.amountFilter.donationIsActive = false;
        this.donationsFilterActive = false;
      }
    }

    if (type === 'cheerFilter') {
      console.log('cheerFilter is toggled...');
      if (event.checked) {
        console.log('Turning cheer filter on...');
        this.filter.amountFilter.filterByAmount = true;
        this.filter.amountFilter.cheerIsActive = true;
        this.cheerFilterActive = true;
      } else {
        console.log('Turning cheer filter off...');

        if (!this.donationsFilterActive) {
          this.filter.amountFilter.filterByAmount = false;
        }

        this.filter.amountFilter.cheerIsActive = false;
        this.cheerFilterActive = false;
      }
    }
  }

  inputChange(input, type) {
    if (type === 'bumpVal') {
      console.log('Setting bump threshold...');
      const valMs = input.value * 60000;
      this.filter.bumpThreshold = valMs;
      this.bumpFilterVal = input.value;
      console.log(`Bump threshold set to: ${valMs}`);
    }

    if (type === 'resubVal') {
      console.log('Setting resub threshold...');

      if (this.filter.subscriptionFilter !== null) {
        this.filter.subscriptionFilter.monthsThreshold = input.value;
        this.resubFilterVal = input.value;
        console.log(`Resub threshold set to: ${this.resubFilterVal}`);
      }
    }

    if (type === 'tierVal') {
      console.log('Setting tier threshold...');
      if (this.filter.subscriptionFilter !== null) {
        // Times 1000 because sub plan goes by 1000, 2000, 3000 //
        this.filter.subscriptionFilter.subPlanThreshold = input.value * 1000;
        this.tierFilterVal = input.value;
        console.log(`Tier threshold set to: ${this.tierFilterVal}`);
      }
    }

    if (type === 'donationVal') {
      console.log('Setting donation threshold...');
      if (this.filter.amountFilter !== null) {
        this.filter.amountFilter.donationThreshold = input.value;
        this.donationFilterVal = input.value;
        console.log(`Donation threshold set to: ${this.donationFilterVal}`);
      }
    }

    if (type === 'cheerVal') {
      console.log('Setting bit threshold...');
      if (this.filter.amountFilter !== null) {
        this.filter.amountFilter.cheerThreshold = input.value;
        this.cheerFilterVal = input.value;
        console.log(`Cheer threshold set to: ${this.cheerFilterVal}`);
      }
    }
  }

  updateSettings() {
    console.log('Updating settings...');
    this.parent.updateEventList(this.id, this.filter);
    this.isEdit = false;
  }

  removeList() {
    console.log('Removing list...');
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

    if (foundEvent !== undefined && !foundEvent.didRead) {
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
