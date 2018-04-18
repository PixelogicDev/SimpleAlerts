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
import { Settings } from '../shared/models/settings/settings.model';
import { Filter } from '../shared/models/filters/filter.model';

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
  eventLists: Array<any> = [];

  // email: String;
  // twitchTokenRoute = 'http://localhost:8000/api/v1/twitch/token';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private settings: Settings,
    private messageService: MessageService
  ) {
    this.settings = new Settings();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      // -- MAD PROPS Sliomere -- //
      // this.twitchAuthComplete = window.document.referrer;

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
      /* if (this.twitchAuthComplete === '') {
        console.log('Coming from another auth redirect.');
        this.getStreamlabsData();
      } else {
        this.getTwitchData();
      } */
    });
  }

  // Helpers //
  addEventList(title: string) {
    if (title !== null) {
      // Create eventList Obj //
      const eventList = {
        // HOPEFULLY creates rando id //
        id: Math.random()
          .toString(36)
          .substring(7),
        title: title,
        filter: null
      };

      this.eventLists.push(eventList);

      // MAD PROPS 3sm_ //
      (<HTMLInputElement>document.getElementById('listTitle')).value = '';
    }
  }

  updateEventList(id: string, filter: Filter) {
    // Find eventList in array //
    const listIndex = this.eventLists.findIndex(list => {
      return list.id === id;
    });

    // Set filter property on eventList obj //
    this.eventLists[listIndex].filter = filter;
    this.settings.eventList = this.eventLists;

    // Send to server for db //
    this.updateSettings();

    // Log finished //
    console.log(`Updated settings for: ${this.username}`);
  }

  getStreamlabsData(complete) {
    this.http
      .post(this.streamlabsTokenRoute, { code: this.code })
      .subscribe(data => {
        console.log('Received Streamlabs Data.');
        this.twitchDisplayName = data['twitchDisplayName'];
        this.username = data['username'];
        this.settings.username = data['username'];
        this.settings.eventList = null;
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
