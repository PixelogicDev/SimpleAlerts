import { Event } from '../event.model';

// Filters //
import { SubFilter } from '../filters/subFilter.model';

// Each component gets its own filter. This filter model controls all the filter propertiers per event-list //
export class Filter {
  isActive: boolean;
  bumpThreshold: number; // Number of ms until bumping to top of list
  subscriptionFilter: SubFilter;
  cheerFilter: any;
  donationFilter: any;

  constructor() {
    this.isActive = true;
    this.bumpThreshold = 60000;
    this.subscriptionFilter = null;
    this.cheerFilter = null;
    this.donationFilter = null;
  }

  // -- Filters -- //
  private bumpToTopByTime(eventList: Array<Event>): Array<Event> {
    // Loop through each event, if threshold time has been passed, bump to top //
    const tempList = Array<Event>();

    eventList.forEach((event, index) => {
      if (!event.didRead) {
        const currentMs = new Date().getTime();
        const eventMs = new Date(event.timestamp).getTime();
        const difference = currentMs - eventMs;

        console.log(
          `bumpThreshold: ${this.bumpThreshold} : difference: ${difference}`
        );

        // Only bump one time //
        if (difference >= this.bumpThreshold && !event.didBump) {
          console.log('Bumping to top...');
          tempList.unshift(event);
          event.didBump = true;
          console.log('Bumped!');
        } else {
          tempList.push(event);
        }
      } else {
        tempList.push(event);
      }
    });

    return tempList;
  }

  public runFilters(eventList: Array<Event>): Array<Event> {
    let filteredEvents = eventList;
    if (this.isActive) {
      console.log('Filter is active.');

      if (this.bumpThreshold !== 0) {
        console.log('Filtering by timestamp...');
        filteredEvents = this.bumpToTopByTime(filteredEvents);
        console.log('Timestamp filter complete.');
      }

      if (this.subscriptionFilter !== null) {
        console.log('SubFilter available.');

        if (this.subscriptionFilter.filterByMonths) {
          console.log('Filtering by sub month...');
          filteredEvents = this.subscriptionFilter.byMonths(filteredEvents);
          console.log('SubFilter complete.');
        }
      }
    }

    return filteredEvents;
  }
}
