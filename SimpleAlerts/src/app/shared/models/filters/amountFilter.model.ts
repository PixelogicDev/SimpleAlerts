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
    let currentThreshold;

    if (this.filterByAmount) {
      eventList.forEach(event => {
        if (!event.didRead) {
          console.log(`Cheer is active: ${this.cheerIsActive}`);
          console.log(`Donation is active: ${this.donationIsActive}`);
          if (this.cheerIsActive && event.type === 'new_cheer') {
            console.log('Using cheer threshold.');
            currentThreshold = this.cheerThreshold;
          } else {
            currentThreshold = 0;
          }

          if (this.donationIsActive && event.type === 'new_donation') {
            console.log('Using donation threshold.');
            currentThreshold = this.donationThreshold;
          } else {
            currentThreshold = 0;
          }

          if (currentThreshold !== 0) {
            console.log(
              `amountThreshold: ${currentThreshold} : currentAmount: ${
                event.amount
              }`
            );

            // Only bump one time //
            if (+event.amount >= currentThreshold) {
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
    }

    return tempList;
  }
}
