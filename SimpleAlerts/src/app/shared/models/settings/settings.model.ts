import { EventList } from './eventList.model';

export class Settings {
  // List of components
  username: string;
  eventList: Array<EventList>;

  toJson() {
    return {
      username: this.username,
      eventList: this.eventList
    };
  }
}
