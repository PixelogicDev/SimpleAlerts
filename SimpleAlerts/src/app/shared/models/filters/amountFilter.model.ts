import { Event } from '../event.model';

export class AmountFilter {
  filterByAmount: boolean;
  cheerThreshold: number;
  donationThreshold: number;

  constructor() {
    this.filterByAmount = false;
    this.cheerThreshold = 0;
    this.donationThreshold = 0;
  }

  byAmount(eventList: Array<Event>): Array<Event> {
    console.log('Filtering events by amount...');
    const tempList = Array<Event>();
    let currentThreshold;

    eventList.forEach(event => {
      if (!event.didRead) {
        if (event.type === 'new_cheer') {
          console.log('Using cheer threshold.');
          currentThreshold = this.cheerThreshold;
        }

        if (event.type === 'new_donation') {
          console.log('Using donation threshold.');
          currentThreshold = this.donationThreshold;
        }

        if (currentThreshold !== 0) {
          console.log(
            `amountThreshold: ${currentThreshold} : currentAmount: ${
              event.amount
            }`
          );

          // Only bump one time //
          if (this.filterByAmount && +event.amount >= currentThreshold) {
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
      }
    });

    return tempList;
  }
}
