import { Filter } from '../filters/filter.model';

export class EventList {
  id: String;
  title: String;
  aciveEvents: Array<String>;
  filter: any;

  constructor(
    id: string,
    title: string,
    activeEvents: Array<string>,
    filter: Filter
  ) {
    this.id = id;
    this.title = title;
    this.aciveEvents = activeEvents;
    this.filter = filter;
  }
}
