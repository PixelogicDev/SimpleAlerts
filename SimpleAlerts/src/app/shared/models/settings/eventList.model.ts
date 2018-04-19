import { Filter } from '../filters/filter.model';
import { SubFilter } from '../filters/subFilter.model';
import { AmountFilter } from '../filters/amountFilter.model';

export class EventList {
  id: String;
  title: String;
  // activeEvents: Array<String>;
  filter: Filter;

  constructor(
    id: string,
    title: string,
    // activeEvents: Array<string>,
    filter: any
  ) {
    this.id = id;
    this.title = title;
    // this.activeEvents = activeEvents;
    this.filter = this.mapJson(filter);
  }

  // -- Helpers -- //
  private mapJson(filterObj: any): Filter {
    const currentSubFilter = filterObj.subscriptionFilter;
    const currentAmountFilter = filterObj.amountFilter;
    const subFilter = new SubFilter();
    const amountFilter = new AmountFilter();
    const filter = new Filter();

    // Sub Filter //
    if (currentSubFilter !== null) {
      subFilter.byMonths = currentSubFilter.filterByMonths;
      subFilter.monthsThreshold = currentSubFilter.monthsThreshold;
      subFilter.filterBySubPlan = currentSubFilter.filterBySubPlan;
      subFilter.subPlanThreshold = currentSubFilter.subPlanThreshold;
    } else {
      filter.subscriptionFilter = null;
    }

    // Amount Filter //
    if (currentAmountFilter !== null) {
      amountFilter.filterByAmount = currentAmountFilter.filterByAmount;
      amountFilter.cheerIsActive = currentAmountFilter.cheerIsActive;
      amountFilter.cheerThreshold = currentAmountFilter.cheerIsThreshold;
      amountFilter.donationIsActive = currentAmountFilter.donationIsActive;
      amountFilter.donationThreshold = currentAmountFilter.donationThreshold;
    } else {
      filter.amountFilter = null;
    }

    // Filter //
    filter.isActive = filterObj.isActive;
    filter.bumpIsActive = filterObj.bumpIsActive;
    filter.bumpThreshold = filterObj.bumpThreshold;
    filter.subscriptionFilter = subFilter;
    filter.amountFilter = amountFilter;

    return filter;
  }
}
