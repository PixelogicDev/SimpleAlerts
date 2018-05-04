import { Event } from '../event.model';

// Filters //
import { SubFilter } from '../filters/subFilter.model';
import { AmountFilter } from '../filters/amountFilter.model';

// Each component gets its own filter. This filter model controls all the filter propertiers per event-list //
export class Filter {
  isActive: boolean;
  bumpIsActive: boolean;
  bumpThreshold: number; // Number of ms until bumping to top of list
  subscriptionFilter: SubFilter;
  amountFilter: AmountFilter;

  constructor() {
    this.isActive = true;
    this.bumpIsActive = false;
    this.bumpThreshold = 300000; // In ms
    this.subscriptionFilter = null;
    this.amountFilter = null;
  }

  // -- Filters -- //
  public runFilters(eventList: Array<Event>): Array<Event> {
    let filteredEvents = eventList;
    if (this.isActive) {
      // -- All time threshold -- //
      if (this.bumpIsActive) {
        filteredEvents = this.bumpToTopByTime(filteredEvents);
      }

      // -- Sub Filters --//
      if (this.subscriptionFilter !== null) {
        if (this.subscriptionFilter.filterByMonths) {
          filteredEvents = this.subscriptionFilter.byMonths(filteredEvents);
        }

        if (this.subscriptionFilter.filterBySubPlan) {
          filteredEvents = this.subscriptionFilter.bySubPlan(filteredEvents);
        }
      }

      // -- Amount Filters (Donations & Cheers) -- //
      if (this.amountFilter !== null) {
        if (this.amountFilter.filterByAmount) {
          filteredEvents = this.amountFilter.byAmount(filteredEvents);
        }
      }
    }

    // Run duration update //
    filteredEvents.forEach((event, index) => {
      filteredEvents[index].duration = event.getDuration();
    });

    return filteredEvents;
  }

  public enableAllFilters() {
    // Subscriptions Filter //
    if (this.subscriptionFilter !== null) {
      this.subscriptionFilter.filterByMonths = true;
      this.subscriptionFilter.filterBySubPlan = true;
    }

    // Amount Filter //
    if (this.amountFilter !== null) {
      this.amountFilter.filterByAmount = true;
    }
  }

  private bumpToTopByTime(eventList: Array<Event>): Array<Event> {
    // Loop through each event, if threshold time has been passed, bump to top //
    const tempList = Array<Event>();

    eventList.forEach((event, index) => {
      if (!event.didRead) {
        const currentMs = new Date().getTime();
        const eventMs = new Date(event.timestamp).getTime();
        const difference = currentMs - eventMs;

        // Only bump one time //
        if (difference >= this.bumpThreshold && !event.didBump) {
          tempList.unshift(event);
          event.didBump = true;
        } else {
          tempList.push(event);
        }
      } else {
        tempList.push(event);
      }
    });

    return tempList;
  }
}
