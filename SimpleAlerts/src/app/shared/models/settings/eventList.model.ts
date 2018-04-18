import { Filter } from '../filters/filter.model';

export class EventList {
  id: String;
  title: String;
  // activeEvents: Array<String>;
  filter: Filter;

  constructor(
    id: string,
    title: string,
    // activeEvents: Array<string>,
    filter: Filter
  ) {
    this.id = id;
    this.title = title;
    // this.activeEvents = activeEvents;
    this.filter = filter;
  }
}
