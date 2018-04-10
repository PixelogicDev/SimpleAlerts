export class FollowFilter {
  filterActive: Boolean;
  descending: Boolean;

  constructor() {
    this.filterActive = false;
    this.descending = false;
  }

  // -- Sort Logic -- //
  // ascend, descend //
  sort(type: string, events: Array<any>) {
    console.log('Applying descend filter...');
    // Convert timestamp to Date object //
    return events.sort((a, b) => {
      const date1 = new Date(a.timestamp);
      const date2 = new Date(b.timestamp);

      if (type === 'descend') {
        return date1.getTime() - date2.getTime();
      }

      if (type === 'ascend') {
        return date2.getTime() - date1.getTime();
      }
    });
  }
}
