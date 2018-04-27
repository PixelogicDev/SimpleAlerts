import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { MessageService } from '../services/message.service';
import { EventListComponent } from '../event-list/event-list.component';

// Models //
import { Follower } from '../shared/models/follower.model';
import { Donation } from '../shared/models/donation.model';
import { Subscription } from '../shared/models/subscription.model';
import { Cheer } from '../shared/models/cheer.model';

// Settings //
import { Settings } from '../shared/models/settings/settings.model';
import { Filter } from '../shared/models/filters/filter.model';
import { EventList } from '../shared/models/settings/eventList.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Properties //
  code: String;
  ws: $WebSocket;
  streamlabsTokenRoute = 'http://localhost:8000/api/v1/streamlabs/token';
  updateSettingsRoute = 'http://localhost:8000/api/v1/settings/';
  twitchDisplayName: String;
  username: String;
  streamLabsAuthUrl = 'https://www.streamlabs.com/api/v1.0/authorize' +
  '?client_id=3cHN5exsWXQhEaKKvTkcuFQTA70Besv08T5aWMjw' +
  '&redirect_uri=http://localhost:4200/dashboard' +
  '&response_type=code&scope=donations.read+socket.token';
  settings: Settings;
  eventLists: Array<EventList> = [];
  // email: String;
  // twitchTokenRoute = 'http://localhost:8000/api/v1/twitch/token';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];

      this.getStreamlabsData(() => {
        // Setup Websocket //
        this.ws.onMessage(
          (msg: MessageEvent) => {
            let eventObj;

            try {
              eventObj = JSON.parse(msg.data);

              if (eventObj.type === 'connection_open') {
                console.log(eventObj.data);
              } else {
                const eventType = this.generateEventType(eventObj);
                this.messageService.sendEvent(eventType);
              }
            } catch (error) {
              console.log('Error parsing JSON in SimpleAlertsSocket: ' + error);
            }
          },
          {
            autoApply: false
          }
        );
      });
    });
  }

  // Helpers //
  addEventList(element: any) {
    if (element !== null) {
      const id = Math.random()
        .toString(36)
        .substring(7);

      // Create eventList //
      const eventList = new EventList(id, element.value, new Filter(), {
        follows: false,
        subscriptions: false,
        cheers: false,
        donations: false
      });

      this.settings.eventList.push(eventList);
      this.eventLists = this.settings.eventList;

      console.log(this.eventLists);

      // MAD PROPS 3sm_ //
      element.value = '';
    }
  }

  updateEventList(id: string, filter: Filter, activeEvents: any) {
    // Find eventList in array //
    const listIndex = this.settings.eventList.findIndex(list => {
      return list.id === id;
    });

    // Set filter property on eventList obj //
    this.settings.eventList[listIndex].filter = filter;

    // Set active event settings //
    this.settings.eventList[listIndex].activeEvents = activeEvents;

    // Send to server for db //
    this.updateSettings();

    // Log finished //
    console.log(`Updated settings for: ${this.username}`);
  }

  removeEventList(id: string) {
    // Find eventList in array //
    const listIndex = this.settings.eventList.findIndex(list => {
      return list.id === id;
    });

    // Splice array //
    this.eventLists.splice(listIndex, 1);

    // Send removal to server //
    this.updateSettings();

    // Log finished //
    console.log(`Removed event list for: ${this.username}`);
  }

  getStreamlabsData(complete) {
    this.http
      .post(this.streamlabsTokenRoute, { code: this.code })
      .subscribe(data => {
        console.log('Received Streamlabs Data.');
        this.twitchDisplayName = data['twitchDisplayName'];

        // Get username info //
        this.username = data['username'];

        // Get settings data //
        const currentSettings = data['settings'];

        if (currentSettings !== null) {
          console.log('Found settings in db.');

          // Get array of eventLists and loop //
          currentSettings.forEach(list => {
            const currentEventList = new EventList(
              list.id,
              list.title,
              JSON.parse(JSON.stringify(list.filter)),
              list.activeEvents
            );

            this.eventLists.push(currentEventList);
          });

          this.settings = new Settings(this.username, this.eventLists);
        } else {
          console.log('Did not find any settings object, creating new.');
          this.settings = new Settings(this.username, new Array<EventList>());
        }

        this.ws = new $WebSocket(
          `ws://127.0.0.1:8080/?user=${data['username']}`
        );

        complete();
      });
  }

  // Can send subscription message out in this method as well //
  generateEventType(json: any): any {
    switch (json.type) {
      case 'new_follower':
        return new Follower(json.data);
      case 'new_donation':
        return new Donation(json.data);
      case 'new_subscription':
        return new Subscription(json.data);
      case 'new_resubscription':
        return new Subscription(json.data);
      case 'new_cheer':
        return new Cheer(json.data);
    }
  }

  updateSettings() {
    console.log('Updating settings...');
    this.http
      .post(this.updateSettingsRoute + this.username, this.settings.toJson())
      .subscribe(response => {
        console.log(response['status']);
      });
  }
  /* getTwitchData() {
    this.http
      .post(this.twitchTokenRoute, this.generateToken())
      .subscribe(data => {
        console.log('Received Twitch Data.');
        this.displayName = data['twitchDisplayName'];
        this.email = data['twitchEmail'];
      });
  } */
}
