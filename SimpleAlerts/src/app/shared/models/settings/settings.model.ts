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

  private deserializeEventLists(obj: string): Array<EventList> {
    const lists = new Array<EventList>();
    const eventLists = JSON.parse(obj);

    if (eventLists !== null) {
      console.log('Deserializing event lists...');

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

      console.log('Event lists set.');
    } else {
      console.log('Did not find any event lists, setting a new one.');
    }

    return lists;
  }
}
