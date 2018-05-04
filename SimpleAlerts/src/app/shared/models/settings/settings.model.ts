import { EventList } from './eventList.model';

export class Settings {
  // List of components
  username: String;
  eventLists: Array<EventList>;

  constructor(username: String, savedLists: any) {
    this.username = username;
    this.eventLists = this.deserializeEventLists(savedLists);
  }

  public toJson() {
    return { username: this.username, eventList: this.eventLists };
  }

  private deserializeEventLists(data: any): Array<EventList> {
    const lists = new Array<EventList>();
    let eventLists;

    if (typeof data === 'string') {
      eventLists = JSON.parse(data);
    } else {
      eventLists = data;
    }

    if (eventLists !== null) {
      // Get array of eventLists and loop //
      eventLists.forEach(list => {
        const currentEventList = new EventList(
          list.id,
          list.title,
          JSON.parse(JSON.stringify(list.filter)),
          list.activeEvents
        );

        lists.push(currentEventList);
      });
    } else {
      console.log('Did not find any event lists, setting a new one.');
    }

    return lists;
  }
}
