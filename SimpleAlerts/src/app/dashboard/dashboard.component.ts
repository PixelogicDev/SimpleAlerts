import { Component, OnInit, HostListener } from '@angular/core';
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
import { environment } from '../../environments/environment';

// Session Storage //
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Properties //
  ws: $WebSocket;
  streamlabsTokenRoute = environment.baseServerPath + 'api/v1/streamlabs/token';
  updateSettingsRoute = environment.baseServerPath + 'api/v1/settings/';
  twitchDisplayName: String;
  username: String;
  settings: Settings;
  eventLists: Array<EventList> = [];
  sessionData: any;

  // Close websocket before close //
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    // Refresh or page closed, closet socket //
    this.ws.send('close').subscribe(
      msg => {
        console.log('next', msg.data);
      },
      msg => {
        console.log('error', msg);
      },
      () => {
        console.log('complete');
        // Tell server to close socket //
        this.ws.close();
      }
    );
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit() {
    // Check for session data //
    this.sessionData = this.sessionStorageService.getSessionData();

    if (this.sessionData) {
      console.log('Session data is here. Setting props...');

      // Set properties with session storage //
      this.username = this.sessionData.username;
      this.twitchDisplayName = this.sessionData.displayName;
      this.settings = new Settings(this.username, this.sessionData.settings);
      this.eventLists = this.settings.eventLists;

      // On page refresh, websocket connections are broken, always setup again //
      this.connectWebsocket();
    } else {
      console.log('Session data not here. Starting auth...');

      this.route.queryParams.subscribe(params => {
        this.getStreamlabsData(params['code']);
      });
    }
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

      this.settings.eventLists.push(eventList);
      // To trigger update need to set our eventLists prop here //
      this.eventLists = this.settings.eventLists;

      // MAD PROPS 3sm_ //
      element.value = '';

      // Save to database & session storage //
      this.updateSettings();
    }
  }

  updateEventList(
    id: string,
    title: string,
    filter: Filter,
    activeEvents: any
  ) {
    // Find eventList in array //
    const listIndex = this.settings.eventLists.findIndex(list => {
      return list.id === id;
    });

    this.settings.eventLists[listIndex].title = title;

    // Set filter property on eventList obj //
    this.settings.eventLists[listIndex].filter = filter;

    // Set active event settings //
    this.settings.eventLists[listIndex].activeEvents = activeEvents;

    // Send to server for db //
    this.updateSettings();
  }

  removeEventList(id: string) {
    // Find eventList in array //
    const listIndex = this.settings.eventLists.findIndex(list => {
      return list.id === id;
    });

    // Splice array //
    this.eventLists.splice(listIndex, 1);

    // Send removal to server //
    this.updateSettings();
  }

  getStreamlabsData(code: string) {
    this.http
      .post(this.streamlabsTokenRoute, { code: code })
      .subscribe(data => {
        if (!environment.production) {
          console.log('Received Streamlabs Data.');
        }

        this.twitchDisplayName = data['twitchDisplayName'];

        // Get username info //
        this.username = data['username'];

        // Create new settings object //
        this.settings = new Settings(this.username, data['settings']);
        this.eventLists = this.settings.eventLists;

        // Connect Websocket //
        this.connectWebsocket();

        // Set session storage //
        this.sessionStorageService.setSessionData({
          username: this.username,
          displayName: this.twitchDisplayName,
          settings: data['settings']
        });
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
    // Convert settings to json //
    const settingsJson = this.settings.toJson();

    // Update session storage //
    this.sessionStorageService.setSessionData({
      username: this.username,
      displayName: this.twitchDisplayName,
      settings: JSON.stringify(settingsJson.eventList)
    });

    this.http
      .post(this.updateSettingsRoute + this.username, settingsJson)
      .subscribe(response => {
        console.log(response['status']);
      });
  }

  connectWebsocket() {
    this.ws = new $WebSocket(
      environment.baseSimpleSocketPath + `?user=${this.username}`
    );
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
      { autoApply: false }
    );
  }
}
