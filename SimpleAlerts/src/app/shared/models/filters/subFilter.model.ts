import { Event } from '../event.model';

export class SubFilter {
  filterByMonths: boolean;
  monthsThreshold: number;
  filterBySubPlan: boolean;
  subPlanThreshold: number;

  constructor() {
    this.filterByMonths = false;
    this.monthsThreshold = 0;
    this.filterBySubPlan = false;
    this.subPlanThreshold = 0;
  }

  byMonths(eventList: Array<Event>): Array<Event> {
    console.log('Filtering events by sub month...');
    const tempList = Array<Event>();

    if (this.monthsThreshold !== 0) {
      eventList.forEach((event, index) => {
        if (!event.didRead) {
          console.log(
            `monthsThreshold: ${this.monthsThreshold} : currentMonth: ${
              event.months
            }`
          );

          // Only bump one time //
          if (this.filterByMonths && +event.months >= this.monthsThreshold) {
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
    }

    return tempList;
  }

  bySubPlan(eventList: Array<Event>): Array<Event> {
    console.log('Filtering events by tier...');
    const tempList = Array<Event>();

    if (this.subPlanThreshold !== 0) {
      eventList.forEach((event, index) => {
        if (!event.didRead) {
          console.log(
            `subPlanThreshold: ${this.subPlanThreshold} : currentSubPlan: ${
              event.sub_plan
            }`
          );

          // Only bump one time //
          if (
            this.filterBySubPlan &&
            +event.sub_plan >= this.subPlanThreshold
          ) {
            console.log('Bumping to top...');
            event.didBump = true;
            tempList.unshift(event);
            console.log('Bumped!');
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
