import { EventList } from './eventList.model';

export class Settings {
  // List of components
  username: String;
  eventList: Array<EventList>;

  constructor(username: String, eventList: Array<EventList>) {
    this.username = username;
    this.eventList = eventList;
  }

  toJson() {
    return {
      username: this.username,
      eventList: this.eventList
    };
  }
}
