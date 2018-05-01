import { Event } from '../event.model';

export class AmountFilter {
  filterByAmount: boolean;
  cheerIsActive: boolean;
  cheerThreshold: number;
  donationIsActive: boolean;
  donationThreshold: number;

  constructor() {
    this.filterByAmount = false;
    this.cheerIsActive = false;
    this.cheerThreshold = 1000;
    this.donationIsActive = false;
    this.donationThreshold = 25;
  }

  byAmount(eventList: Array<Event>): Array<Event> {
    console.log('Filtering events by amount...');
    const tempList = Array<Event>();
    let currentThreshold = 0;

    if (this.filterByAmount) {
      eventList.forEach(event => {
        if (!event.didRead) {
          if (this.cheerIsActive && event.type === 'new_cheer') {
            currentThreshold = this.cheerThreshold;
          }

          if (this.donationIsActive && event.type === 'new_donation') {
            currentThreshold = this.donationThreshold;
          }

          if (currentThreshold !== 0) {
            // Only bump one time //
            if (+event.amount >= currentThreshold && !event.didBump) {
              tempList.unshift(event);
              event.didBump = true;
            } else {
              tempList.push(event);
            }
          } else {
            tempList.push(event);
          }
        } else {
          tempList.push(event);
        }
      });
    }

    return tempList;
  }
}
