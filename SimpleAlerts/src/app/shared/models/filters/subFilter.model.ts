import { Event } from '../event.model';

export class SubFilter {
  filterByMonths: boolean;
  monthsThreshold: number;
  filterBySubPlan: boolean;
  subPlanThreshold: number;

  constructor() {
    this.filterByMonths = false;
    this.monthsThreshold = 5;
    this.filterBySubPlan = false;
    this.subPlanThreshold = 2000;
  }

  byMonths(eventList: Array<Event>): Array<Event> {
    const tempList = Array<Event>();

    if (this.filterByMonths) {
      if (this.monthsThreshold !== 0) {
        eventList.forEach((event, index) => {
          if (!event.didRead) {
            if (+event.months >= this.monthsThreshold && !event.didBump) {
              tempList.unshift(event);
              // Only bump one time //
              event.didBump = true;
            } else {
              tempList.push(event);
            }
          } else {
            tempList.push(event);
          }
        });
      }
    }

    return tempList;
  }

  bySubPlan(eventList: Array<Event>): Array<Event> {
    const tempList = Array<Event>();

    if (this.filterBySubPlan) {
      if (this.subPlanThreshold !== 0) {
        eventList.forEach((event, index) => {
          if (!event.didRead) {
            // Only bump one time //
            if (+event.sub_plan >= this.subPlanThreshold && !event.didBump) {
              event.didBump = true;
              tempList.unshift(event);
            } else {
              tempList.push(event);
            }
          } else {
            tempList.push(event);
          }
        });
      }
    }

    return tempList;
  }
}
