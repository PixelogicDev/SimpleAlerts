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
    console.log('Filtering events by sub month...');
    const tempList = Array<Event>();

    if (this.filterByMonths) {
      if (this.monthsThreshold !== 0) {
        eventList.forEach((event, index) => {
          if (!event.didRead) {
            console.log(
              `monthsThreshold: ${this.monthsThreshold} : currentMonth: ${
                event.months
              }`
            );

            if (+event.months >= this.monthsThreshold && !event.didBump) {
              console.log('Bumping to top...');
              tempList.unshift(event);
              // Only bump one time //
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
    }

    return tempList;
  }

  bySubPlan(eventList: Array<Event>): Array<Event> {
    console.log('Filtering events by tier...');
    const tempList = Array<Event>();

    if (this.filterBySubPlan) {
      if (this.subPlanThreshold !== 0) {
        eventList.forEach((event, index) => {
          if (!event.didRead) {
            console.log(
              `subPlanThreshold: ${this.subPlanThreshold} : currentSubPlan: ${
                event.sub_plan
              }`
            );

            // Only bump one time //
            if (+event.sub_plan >= this.subPlanThreshold && !event.didBump) {
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
    }

    return tempList;
  }
}
