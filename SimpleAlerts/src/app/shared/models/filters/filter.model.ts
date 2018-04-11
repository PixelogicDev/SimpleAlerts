import { Event } from '../event.model';

// Each component gets its own filter. This filter model controls all the filter propertiers per event-list //
export class Filter {
  isActive: boolean;
  bumpThreshold: number; // Number of ms until bumping to top of list
  subscriptionFilter: any;
  cheerFilter: any;
  donationFilter: any;

  constructor() {
    this.isActive = true;
    this.bumpThreshold = 0;
    this.subscriptionFilter = null;
    this.cheerFilter = null;
    this.donationFilter = null;
  }

  // -- Filters -- //
  public bumpToTop(eventList: Array<Event>): Array<Event> {
    // Loop through each event, if threshold time has been passed, bump to top //
    const tempList = Array<Event>();

    eventList.forEach((event, index) => {
      const currentMs = new Date().getTime();
      const eventMs = new Date(event.timestamp).getTime();
      const difference = currentMs - eventMs;

      console.log(
        `bumpTheshold: ${this.bumpThreshold} : difference: ${difference}`
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
    });

    return tempList;
  }

  /* public runFilters(eventList: Array<Event>): Array<Event> {
    let filteredEvents = Array<Event>();
    if (this.isActive) {
      if (this.followFilter !== null) {
        filteredEvents = this.followFilter.bumpToTop(eventList);
      }
    }

    return filteredEvents;
  } */
}
