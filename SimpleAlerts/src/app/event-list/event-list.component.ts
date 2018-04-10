import { Component, OnInit, Input } from '@angular/core';
import { Subscription as rxSubscription } from 'rxjs/Subscription';
import { MessageService } from '../services/message.service';

import { Event } from '../shared/models/event.model';
import { FollowFilter } from '../shared/models/follow/followFilter.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  // Properties //
  @Input() title: string;
  eventTypes: Array<string>;
  subscription: rxSubscription;
  eventList = new Array<Event>();
  follows: Boolean = false;
  subscriptions: Boolean = false;
  cheers: Boolean = false;
  donations: Boolean = false;
  followFilter = new FollowFilter();

  constructor(private messageService: MessageService) {
    // Subscribe to Dashboard component events //
    this.messageService.subscribeToEvent().subscribe(event => {
      if (event.type === 'new_follower' && this.follows) {
        this.eventList.push(new Event(event));
        // Apply Filters //
        this.eventList = this.followFilter.sort('descend', this.eventList);
      }

      if (event.type === 'new_subscription' && this.subscriptions) {
        this.eventList.push(new Event(event));
      }

      if (event.type === 'new_cheer' && this.cheers) {
        this.eventList.push(new Event(event));
      }

      if (event.type === 'new_donation' && this.donations) {
        this.eventList.push(new Event(event));
      }
    });
  }

  ngOnInit() {}

  /*
    Filters
    - Toggle on/off for filter based on options selected
    - Input/Checkbox for filter options
    - Logic to handle filters

    Followers
      -> Time Order (Desc/Asc)
        -> Default value is Desc (or newest follows appear on top)

      -> Subscriptions
        -> Time Order (Desc/Asc)
        -> Tier (1000, 2000, 3000)
        -> Resub Month value (x2, x3, x4)

      -> Cheers
        -> Time Order (Desc/Asc)
        -> Amount
          -> Threshold (If over certain amount, jump to top of list)
          -> Highest amount, lowest amount

      -> Donations
        -> Time Order (Des/Asc)
        -> Amount
          -> Threshold (If over certain amount, jump to top of list)
          -> Highest amount, lowest amount
  */
}
